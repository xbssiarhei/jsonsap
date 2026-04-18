import { useSnapshot } from "valtio";
import type { ComponentConfig, StoreInstance, SetAction, CallAction } from "./types";

/**
 * Check if value is a SetAction object
 */
function isSetAction(value: unknown): value is SetAction {
  return (
    typeof value === "object" &&
    value !== null &&
    "$action" in value &&
    (value as SetAction).$action === "set" &&
    "path" in value
  );
}

/**
 * Check if value is a CallAction object
 */
function isCallAction(value: unknown): value is CallAction {
  return (
    typeof value === "object" &&
    value !== null &&
    "$action" in value &&
    (value as CallAction).$action === "call" &&
    "name" in value
  );
}

/**
 * Check if SetAction contains @item.* references (should be resolved by Repeater first)
 */
function hasItemReferences(action: SetAction | CallAction): boolean {
  if ("value" in action && typeof action.value === "string" && action.value.includes("@item.")) {
    return true;
  }
  if ("path" in action && typeof action.path === "string" && action.path.includes("@item.")) {
    return true;
  }
  if ("args" in action && Array.isArray(action.args)) {
    return action.args.some(arg => typeof arg === "string" && arg.includes("@item."));
  }
  if ("params" in action && typeof action.params === "object") {
    return Object.values(action.params || {}).some(
      val => typeof val === "string" && val.includes("@item.")
    );
  }
  return false;
}

/**
 * Resolves @store.* references in component configuration
 * @store.state.* -> reactive state value
 * @store.actions.* -> bound action function
 * @store.computed.* -> computed value
 */
export function resolveStoreReferences(
  config: ComponentConfig,
  store: StoreInstance,
): ComponentConfig {
  const { props, children } = config;
  const resolved = { ...config };
  // const resolved = resolveObject(rest, store) as unknown as ComponentConfig;

  // Resolve props
  if (props && config.type !== "Repeater2") {
    resolved.props = resolveObject(props, store);
  }

  // Resolve children
  if (children) {
    // resolved.children = resolveChildren(children, store);
  }

  return resolved;
}

export function resolveChildren(
  children: ComponentConfig["children"],
  store: StoreInstance,
): ComponentConfig["children"] {
  if (typeof children === "string") {
    const resolved = resolveValue(children, store);

    // If resolved value is an array, map it to components
    if (Array.isArray(resolved)) {
      return resolved;
    }

    return resolved as ComponentConfig;
  }

  if (typeof children === "number") {
    return children;
  }

  if (Array.isArray(children)) {
    return children.map((child) => {
      if (typeof child === "string") {
        const resolved = resolveValue(child, store) as ComponentConfig;

        // If resolved value is an array, return it as-is
        if (Array.isArray(resolved)) {
          return resolved;
        }

        return resolved;
      }
      if (typeof child === "number") {
        return child;
      }
      return resolveStoreReferences(child, store);
    });
  }

  if (!children) {
    return undefined;
  }

  return resolveStoreReferences(children, store);
}

const handlerRegex = /on[A-Z].*/;

function resolveObject(
  obj: Record<string, unknown>,
  store: StoreInstance,
): Record<string, unknown> {
  const resolved: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    // Handle CallAction objects for onChange and onClick
    if (handlerRegex.test(key) && isCallAction(value)) {
      // Skip CallAction with @item.* references - let Repeater resolve them first
      if (hasItemReferences(value)) {
        resolved[key] = value;
        continue;
      }
      resolved[key] = createCallActionHandler(value, store);
      continue;
    }

    // Handle SetAction objects for onChange and onClick
    if (handlerRegex.test(key) && isSetAction(value)) {
      // Skip SetAction with @item.* references - let Repeater resolve them first
      if (hasItemReferences(value)) {
        resolved[key] = value;
        continue;
      }
      resolved[key] = createSetActionHandler(value, store, obj);
      continue;
    }

    if (typeof value === "string" && value.startsWith("@store.")) {
      const resolvedValue = resolveValue(value, store);

      // Special handling for onChange with actions
      if (handlerRegex.test(key) && typeof resolvedValue === "function") {
        // Check for __itemValue from Repeater
        const itemValue = obj["__itemValue"];
        if (itemValue !== undefined) {
          resolved[key] = (e: { target: { value: unknown } }) => {
            (resolvedValue as (...args: unknown[]) => void)(
              e,
              itemValue,
              e.target.value,
            );
          };
          // Don't include __itemValue in final props
          continue;
        }

        // Check if there's an item prop to pass
        const itemProp = obj["item"];
        if (itemProp !== undefined) {
          resolved[key] = (e: { target: { value: unknown } }) => {
            (resolvedValue as (...args: unknown[]) => void)(
              e,
              itemProp,
              e?.target?.value ?? e,
            );
          };
        } else {
          resolved[key] = resolvedValue;
        }
      } else {
        resolved[key] = resolvedValue;
      }
    } else if (key === "__itemValue") {
      // Skip __itemValue, it's only used for onChange
      continue;
    } else if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      !(value instanceof Map) &&
      !(value instanceof Promise) &&
      !("values" in value)
    ) {
      resolved[key] = resolveObject(value as Record<string, unknown>, store);
    } else {
      resolved[key] = value;
    }
  }

  return resolved;
}

/**
 * Creates a handler for CallAction
 * Supports both args array and params object
 */
function createCallActionHandler(
  action: CallAction,
  store: StoreInstance,
) {
  return (e?: { target?: { value: unknown; checked?: boolean; type?: string } }) => {
    const actionFn = store.actions[action.name];
    if (!actionFn) {
      console.warn(`Action "${action.name}" not found in store`);
      return;
    }

    // Build arguments array
    let args: unknown[] = [];

    if (action.args) {
      // Use args array directly
      args = action.args;
    } else if (action.params) {
      // Convert params object to args array (pass as single object)
      args = [action.params];
    }

    // Call the action with event as first argument, then other args
    actionFn(e, ...args);
  };
}

/**
 * Creates a handler for SetAction (works for both onChange and onClick)
 */
function createSetActionHandler(
  action: SetAction,
  store: StoreInstance,
  _obj: Record<string, unknown>,
) {
  return (e?: {
    target?: { value: unknown; checked?: boolean; type?: string };
  }) => {
    const path = action.path.startsWith("/")
      ? action.path.substring(1)
      : action.path;
    const pathParts = path.split(/[./]/);

    // Get the value - either from explicit value prop or from event
    let value: unknown;
    if (action.value !== undefined) {
      // If value is explicitly provided, use it (can be @item.* reference)
      value = action.value;
    } else if (e?.target) {
      // Otherwise get from event (for onChange)
      value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    } else {
      // No value provided and no event target (shouldn't happen)
      return;
    }

    // Set the value in the store
    setNestedValue(store.state, pathParts, value);

    // Call the "then" action if specified
    if (action.then && store.actions[action.then]) {
      store.actions[action.then]();
    }
  };
}

/**
 * Sets a nested value in an object
 */
function setNestedValue(
  obj: Record<string, unknown>,
  path: string[],
  value: unknown,
): void {
  if (path.length === 0) return;

  if (path.length === 1) {
    obj[path[0]] = value;
    return;
  }

  const [first, ...rest] = path;
  if (
    !(first in obj) ||
    typeof obj[first] !== "object" ||
    obj[first] === null
  ) {
    obj[first] = {};
  }

  setNestedValue(obj[first] as Record<string, unknown>, rest, value);
}

function resolveValue(value: string, store: StoreInstance): unknown {
  if (!value.startsWith("@store.")) {
    // Check if string contains @store.* references for interpolation
    if (value.includes("@store.")) {
      return interpolateStoreReferences(value, store);
    }
    return value;
  }

  const path = value.substring(7); // Remove '@store.'
  const parts = path.split(".");

  if (parts.length === 0) {
    return value;
  }

  const [section, ...rest] = parts;

  if (section === "state") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const snapshot = useSnapshot(store.state);
    return getNestedValue(snapshot, rest);
  }

  if (section === "actions") {
    const actionName = rest[0];
    return store.actions[actionName];
  }

  if (section === "computed") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const snapshot = useSnapshot(store.computed);
    return getNestedValue(snapshot, rest);
  }

  return value;
}

function interpolateStoreReferences(
  template: string,
  store: StoreInstance,
): string {
  // Replace all @store.* references in the string
  return template.replace(
    /@store\.(state|actions|computed)\.[\w.]+/g,
    (match) => {
      const value = resolveStoreReference(match, store);
      return String(value ?? "");
    },
  );
}

function resolveStoreReference(
  reference: string,
  store: StoreInstance,
): unknown {
  const path = reference.substring(7); // Remove '@store.'
  const parts = path.split(".");

  if (parts.length === 0) {
    return reference;
  }

  const [section, ...rest] = parts;

  if (section === "state") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const snapshot = useSnapshot(store.state);
    return getNestedValue(snapshot, rest);
  }

  if (section === "computed") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const snapshot = useSnapshot(store.computed);
    return getNestedValue(snapshot, rest);
  }

  return reference;
}

function getNestedValue(obj: unknown, path: string[]): unknown {
  const result = path.reduce((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);

  return Array.isArray(result) ? result.slice() : result;
}

/**
 * Hook to resolve store references in a component config
 * This must be called from within a React component
 */
export function useResolvedConfig(
  config: ComponentConfig,
  store: StoreInstance | null,
): ComponentConfig {
  if (!store) {
    return config;
  }

  return resolveStoreReferences(config, store);
}
