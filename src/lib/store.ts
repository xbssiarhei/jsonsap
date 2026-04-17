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

export function createStore(config: StoreConfig): StoreInstance {
  // Create reactive state with Valtio proxy
  const state = proxy(config.state);

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
    const computedGetters: Record<
      string,
      (get: (obj: unknown) => unknown) => unknown
    > = {};

    Object.entries(config.computed).forEach(([name, computeValue]) => {
      if (isJSONataComputed(computeValue)) {
        // Handle JSONata computed
        computedGetters[name] = (get) => {
          const snapshot = get(state) as Record<string, unknown>;

          // Parse source path: "@store.state.products" -> "products"
          const sourcePath = computeValue.source
            .replace("@store.state.", "")
            .replace("@store.state", "");

          // Get source data from state
          const sourceData = sourcePath
            ? getNestedValue(snapshot, sourcePath)
            : snapshot;

          // Evaluate JSONata expression
          try {
            const expression = jsonata(computeValue.$jsonata);
            const result = expression.evaluate(sourceData);
            return result;
          } catch (error) {
            console.error(`JSONata error in computed.${name}:`, error);
            return null;
          }
        };
      } else {
        // Handle function computed (existing logic)
        computedGetters[name] = (get) => {
          const snapshot = get(state);
          return computeValue(snapshot as Record<string, unknown>);
        };
      }
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
