import { useSnapshot } from "valtio";
import type { ComponentConfig, StoreInstance } from "./types";

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
  const resolved = { ...config };

  // Resolve props
  if (resolved.props) {
    resolved.props = resolveObject(resolved.props, store);
  }

  // Resolve children
  if (resolved.children) {
    resolved.children = resolveChildren(resolved.children, store);
  }

  return resolved;
}

function resolveChildren(
  children: ComponentConfig["children"],
  store: StoreInstance,
): ComponentConfig["children"] {
  if (typeof children === "string") {
    const resolved = resolveValue(children, store);

    // If resolved value is an array, map it to components
    if (Array.isArray(resolved)) {
      return resolved;
    }

    return resolved;
  }

  if (typeof children === "number") {
    return children;
  }

  if (Array.isArray(children)) {
    return children.map((child) => {
      if (typeof child === "string") {
        const resolved = resolveValue(child, store);

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

  return resolveStoreReferences(children, store);
}

function resolveObject(
  obj: Record<string, unknown>,
  store: StoreInstance,
): Record<string, unknown> {
  const resolved: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string" && value.startsWith("@store.")) {
      resolved[key] = resolveValue(value, store);
    } else if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      resolved[key] = resolveObject(value as Record<string, unknown>, store);
    } else {
      resolved[key] = value;
    }
  }

  return resolved;
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

function interpolateStoreReferences(template: string, store: StoreInstance): string {
  // Replace all @store.* references in the string
  return template.replace(/@store\.(state|actions|computed)\.[\w.]+/g, (match) => {
    const value = resolveStoreReference(match, store);
    return String(value ?? '');
  });
}

function resolveStoreReference(reference: string, store: StoreInstance): unknown {
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
  return path.reduce((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
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
