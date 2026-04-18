import { proxy, subscribe } from "valtio";
import { derive } from "derive-valtio";
import jsonata from "jsonata";
import type { StoreConfig, StoreInstance, JSONataComputed } from "./types";

/**
 * Check if value is a JSONataComputed object
 */
function isJSONataComputed(value: unknown): value is JSONataComputed {
  return (
    typeof value === "object" &&
    value !== null &&
    "$jsonata" in value &&
    "source" in value
  );
}

/**
 * Get nested value from object using dot notation path
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  if (!path) return obj;
  return path.split(".").reduce((acc: unknown, part: string) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}

/**
 * Parse source path to get the state key to watch
 * "@store.state.products" -> "products"
 * "@store.state.user.orders" -> "user"
 */
function getSourceRootKey(source: string): string {
  const path = source.replace("@store.state.", "").replace("@store.state", "");
  return path.split(".")[0] || "";
}

export async function createStore(config: StoreConfig): Promise<StoreInstance> {
  // Create reactive state with Valtio proxy
  const state = config.state._isProxy ? config.state : proxy(config.state);

  // Bind actions to state
  const actions: Record<string, (...args: unknown[]) => void> = {};
  if (config.actions) {
    Object.entries(config.actions).forEach(([name, actionFn]) => {
      actions[name] = (...args: unknown[]) => {
        actionFn(state, ...args);
      };
    });
  }

  // Create computed properties using derive-valtio
  let computed: Record<string, unknown> = {};
  if (config.computed) {
    // Separate JSONata and function computed
    const functionComputed: Record<
      string,
      (state: Record<string, unknown>) => unknown
    > = {};
    const jsonataComputed: Record<string, JSONataComputed> = {};

    Object.entries(config.computed).forEach(([name, computeValue]) => {
      if (isJSONataComputed(computeValue)) {
        jsonataComputed[name] = computeValue;
      } else {
        functionComputed[name] = computeValue;
      }
    });

    // Create proxy for JSONata computed results
    const jsonataResults = proxy<Record<string, unknown>>({});

    // Initialize JSONata computed values
    await Promise.all(
      Object.entries(jsonataComputed).map(async ([name, computeValue]) => {
        const sourcePath = computeValue.source
          .replace("@store.state.", "")
          .replace("@store.state", "");

        const sourceData = sourcePath
          ? getNestedValue(state, sourcePath)
          : state;

        try {
          const expression = jsonata(computeValue.$jsonata);
          const result = await expression.evaluate(sourceData);
          jsonataResults[name] = result;
        } catch (error) {
          console.error(`JSONata error in computed.${name}:`, error);
          jsonataResults[name] = null;
        }
      }),
    );

    // Subscribe to state changes and recalculate JSONata computed
    Object.entries(jsonataComputed).forEach(([name, computeValue]) => {
      const sourceRootKey = getSourceRootKey(computeValue.source);

      if (sourceRootKey) {
        // Subscribe to changes in the source data
        subscribe(state, () => {
          const sourcePath = computeValue.source
            .replace("@store.state.", "")
            .replace("@store.state", "");

          const sourceData = sourcePath
            ? getNestedValue(state, sourcePath)
            : state;

          // Recalculate JSONata expression
          const expression = jsonata(computeValue.$jsonata);
          expression
            .evaluate(sourceData)
            .then((result) => {
              jsonataResults[name] = result;
            })
            .catch((error) => {
              console.error(`JSONata error in computed.${name}:`, error);
              jsonataResults[name] = null;
            });
        });
      }
    });

    // Create computed getters combining function and JSONata computed
    const computedGetters: Record<
      string,
      (get: (obj: unknown) => unknown) => unknown
    > = {};

    // Add function computed
    Object.entries(functionComputed).forEach(([name, computeFn]) => {
      computedGetters[name] = (get) => {
        const snapshot = get(state);
        return computeFn(snapshot as Record<string, unknown>);
      };
    });

    // Add JSONata computed (read from jsonataResults proxy)
    Object.keys(jsonataComputed).forEach((name) => {
      computedGetters[name] = (get) => {
        const results = get(jsonataResults);
        return (results as Record<string, unknown>)[name];
      };
    });

    // @ts-expect-error skip error
    computed = derive(computedGetters);
  }

  return {
    state,
    actions,
    computed,
  };
}

export function subscribeToStore(
  store: StoreInstance,
  callback: () => void,
): () => void {
  return subscribe(store.state, callback);
}
