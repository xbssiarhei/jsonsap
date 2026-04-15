import type { Modifier, ModifierCondition, ComponentConfig } from "./types";
import type { StoreInstance } from "./types";

/**
 * Evaluates a single condition against a value
 */
function evaluateCondition(
  condition: ModifierCondition,
  value: unknown,
): boolean {
  const { operator, value: expectedValue } = condition;

  switch (operator) {
    case "equals":
      return value === expectedValue;
    case "notEquals":
      return value !== expectedValue;
    case "greaterThan":
      return typeof value === "number" && typeof expectedValue === "number"
        ? value > expectedValue
        : false;
    case "lessThan":
      return typeof value === "number" && typeof expectedValue === "number"
        ? value < expectedValue
        : false;
    case "contains":
      if (typeof value === "string" && typeof expectedValue === "string") {
        return value.includes(expectedValue);
      }
      if (Array.isArray(value)) {
        return value.includes(expectedValue);
      }
      return false;
    default:
      return false;
  }
}

/**
 * Resolves a path to get the actual value
 * Supports:
 * - Direct prop paths: "status"
 * - Nested paths: "item.status"
 * - Store references: "@store.state.theme"
 */
function resolveValue(
  path: string,
  props: Record<string, unknown>,
  store: StoreInstance | null,
): unknown {
  // Handle store references
  if (path.startsWith("@store.")) {
    if (!store) return undefined;

    const storePath = path.substring(7); // Remove '@store.'
    const [section, ...rest] = storePath.split(".");

    if (section === "state") {
      return getNestedValue(store.state, rest);
    }
    if (section === "computed") {
      return getNestedValue(store.computed, rest);
    }
    return undefined;
  }

  // Handle prop paths
  return getNestedValue(props, path.split("."));
}

/**
 * Gets nested value from object by path array
 */
function getNestedValue(obj: unknown, path: string[]): unknown {
  return path.reduce((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/**
 * Checks if a modifier's conditions are met
 */
function checkModifier(
  modifier: Modifier,
  props: Record<string, unknown>,
  store: StoreInstance | null,
): boolean {
  const { conditions, matchAll = true } = modifier;

  if (matchAll) {
    // AND logic: all conditions must match
    return conditions.every((condition) => {
      const value = resolveValue(condition.path, props, store);
      return evaluateCondition(condition, value);
    });
  } else {
    // OR logic: at least one condition must match
    return conditions.some((condition) => {
      const value = resolveValue(condition.path, props, store);
      return evaluateCondition(condition, value);
    });
  }
}

/**
 * Applies modifiers to component config and returns modified props
 */
export function applyModifiers(
  config: ComponentConfig,
  store: StoreInstance | null,
): Record<string, unknown> {
  const baseProps = config.props || {};

  if (!config.modifiers || config.modifiers.length === 0) {
    return baseProps;
  }

  // Start with base props
  let modifiedProps = { ...baseProps };

  // Apply each matching modifier
  for (const modifier of config.modifiers) {
    if (checkModifier(modifier, baseProps, store)) {
      // Merge modifier props (deep merge for style objects)
      modifiedProps = mergeProps(modifiedProps, modifier.props);
    }
  }

  return modifiedProps;
}

/**
 * Deep merges props, with special handling for style objects
 */
function mergeProps(
  base: Record<string, unknown>,
  override: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...base };

  for (const [key, value] of Object.entries(override)) {
    if (
      key === "style" &&
      typeof value === "object" &&
      value !== null &&
      typeof result[key] === "object" &&
      result[key] !== null
    ) {
      // Deep merge style objects
      result[key] = {
        ...(result[key] as Record<string, unknown>),
        ...(value as Record<string, unknown>),
      };
    } else if (key === "className" && typeof value === "string") {
      // Concatenate className strings
      const baseClass = typeof result[key] === "string" ? result[key] : "";
      result[key] = baseClass ? `${baseClass} ${value}` : value;
    } else {
      // Direct override for other props
      result[key] = value;
    }
  }

  return result;
}
