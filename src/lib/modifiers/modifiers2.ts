import { useSnapshot } from "valtio";
import { evaluateCondition, mergeProps } from "./utils";
import type {
  ComponentConfig,
  Modifier2,
  ModifierCondition2,
  StoreRef,
  StoreInstance,
} from "../types";

/**
 * Checks if a modifier's conditions are met
 * @param modifier - The modifier configuration with conditions and props
 * @param props - Component props (currently unused but kept for API consistency)
 * @param reactiveSnapshots - Pre-collected reactive snapshots from useSnapshot
 * @returns true if conditions match, false otherwise
 */
function checkModifier(
  modifier: Modifier2,
  _props: Record<string, unknown>,
  reactiveSnapshots: Record<string, any> | null,
): boolean {
  const { conditions, matchAll = true } = modifier;

  // Evaluate each condition against reactive snapshot data
  const iteration = (condition: ModifierCondition2): boolean => {
    // Get the reactive snapshot for the store root
    const storeSnapshot = reactiveSnapshots?.[condition.store.store];
    if (!storeSnapshot) return false;

    // Extract the actual value from the snapshot using the condition's path
    const value = getNestedValue(
      storeSnapshot,
      condition.store.path.split("."),
    );

    // Resolve the expected value
    let expectedValue;
    if (
      typeof condition.value === "object" &&
      condition.value !== null &&
      "store" in condition.value
    ) {
      // Value is a StoreRef - get from reactive snapshot
      const valueStoreRef = condition.value as StoreRef;
      const valueSnapshot = reactiveSnapshots?.[valueStoreRef.store];
      expectedValue = valueSnapshot
        ? getNestedValue(valueSnapshot, valueStoreRef.path.split("."))
        : undefined;
    } else {
      // Value is a primitive
      expectedValue = condition.value;
    }

    // Evaluate the condition using the operator (equals, greaterThan, etc.)
    return evaluateCondition(
      {
        path: condition.store.path,
        operator: condition.operator,
        value: expectedValue,
      },
      value,
    );
  };

  if (matchAll) {
    // AND logic: all conditions must match
    return conditions.every(iteration);
  } else {
    // OR logic: at least one condition must match
    return conditions.some(iteration);
  }
}

/**
 * Gets nested value from an object by following a path array
 * Supports both regular objects and Map instances
 * @param obj - The object to traverse
 * @param path - Array of keys to follow (e.g., ["state", "user", "name"])
 * @returns The value at the path, or undefined if not found. Arrays are cloned.
 */
function getNestedValue(obj: unknown, path: string[]): unknown {
  const result = path.reduce((current, key) => {
    // Handle Map instances (try both string and numeric keys)
    if (
      current instanceof Map &&
      (current.has(key) || current.has(Number(key)))
    ) {
      return current.get(key) ?? current.get(Number(key));
    }
    if (Array.isArray(current)) {
      return current.slice().find((item) => String(item.id) === String(key));
    }
    // Handle regular objects
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }

    return undefined;
  }, obj);

  // Clone arrays to prevent mutation issues
  return Array.isArray(result) ? result.slice() : result;
}

/**
 * Applies conditional prop modifications based on store state
 * This is the main entry point for the modifiers2 system
 *
 * Architecture:
 * 1. Collect all unique store ROOT paths referenced in conditions
 * 2. Take reactive snapshots ONCE for each ROOT path using useSnapshot
 * 3. Check each modifier's conditions against the snapshots
 * 4. Merge props from matching modifiers
 *
 * @param config - Component configuration with modifiers2 array
 * @param store - Store instance containing state, actions, computed
 * @returns Modified props object with all matching modifiers applied
 */
export function applyModifiers2(
  config: ComponentConfig,
  store: StoreInstance | null,
): Record<string, unknown> {
  const baseProps = config.props || {};

  // Early return if no modifiers defined
  if (!config.modifiers2 || config.modifiers2.length === 0) {
    return baseProps;
  }

  // Phase 1: Collect all unique ROOT store paths and get proxy objects
  // We collect roots (e.g., "@store/state") not leaf values (e.g., "@store/state/threshold")
  // This ensures we subscribe to proxy objects, not primitives
  const snapshots: Record<string, any> = {};

  config.modifiers2.forEach((modifier) => {
    const { conditions } = modifier;
    conditions.forEach((condition: ModifierCondition2) => {
      // Handle condition.store reference
      if (condition.store?.store?.startsWith("@store/")) {
        const rootPath = condition.store.store;
        if (!snapshots[rootPath]) {
          const path = rootPath.substring(7); // Remove "@store/" prefix
          const parts = path.split("/");
          const snap = getNestedValue(store, parts);
          if (snap) {
            snapshots[rootPath] = snap;
          }
        }
      }

      // Handle condition.value reference (if it's a StoreRef)
      if (
        typeof condition.value === "object" &&
        condition.value !== null &&
        "store" in condition.value
      ) {
        const valueStoreRef = condition.value as StoreRef;
        const rootPath = valueStoreRef.store;
        if (!snapshots[rootPath]) {
          const path = rootPath.substring(7);
          const parts = path.split("/");
          const snap = getNestedValue(store, parts);
          if (snap) {
            snapshots[rootPath] = snap;
          }
        }
      }
    });
  });

  // Phase 2: Convert proxy objects to reactive snapshots
  // This is where useSnapshot is called - outside any loops/conditions
  // Only call useSnapshot on proxy objects, not primitives
  const reactiveSnapshots = Object.keys(snapshots).reduce(
    (acc, key) => {
      const value = snapshots[key];
      // useSnapshot only works with proxy objects, not primitives
      if (value && typeof value === "object") {
        acc[key] = useSnapshot(value);
      } else {
        // For primitives, use the value directly
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, any>,
  );

  // Phase 3: Start with base props and apply modifiers sequentially
  let modifiedProps = { ...config.props };

  // Phase 4: Check each modifier and merge props if conditions match
  for (const modifier of config.modifiers2) {
    if (checkModifier(modifier, baseProps, reactiveSnapshots)) {
      if (modifier.hide) {
        return;
      }
      // Merge with accumulated props (not baseProps) to chain modifiers
      modifiedProps = mergeProps(modifiedProps, modifier.props);
    }
  }

  return modifiedProps;
}
