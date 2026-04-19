import { evaluateCondition, mergeProps, resolveValue } from "./utils";
import type { Modifier, ComponentConfig } from "../types";
import type { StoreInstance } from "../types";
import { useSnapshot } from "valtio";
// import { resolveModifiers } from "../sharedResolver";
// import { useShared } from "../SharedContext";

/**
 * Checks if a modifier's conditions are met
 */
function checkModifier(
  modifier: Modifier,
  props: Record<string, unknown>,
  stateSnapshot: Record<string, unknown> | null,
  computedSnapshot: Record<string, unknown> | null,
): boolean {
  const { conditions, matchAll = true } = modifier;

  if (matchAll) {
    // AND logic: all conditions must match
    return conditions.every((condition) => {
      const value =
        typeof condition.path === "string"
          ? resolveValue(condition.path, props, stateSnapshot, computedSnapshot)
          : condition.path;
      // Resolve condition.value if it's a store reference
      const expectedValue =
        typeof condition.value === "string" &&
        condition.value.startsWith("@store.")
          ? resolveValue(
              condition.value,
              props,
              stateSnapshot,
              computedSnapshot,
            )
          : condition.value;
      return evaluateCondition({ ...condition, value: expectedValue }, value);
    });
  } else {
    // OR logic: at least one condition must match
    return conditions.some((condition) => {
      const value = resolveValue(
        condition.path,
        props,
        stateSnapshot,
        computedSnapshot,
      );
      // Resolve condition.value if it's a store reference
      const expectedValue =
        typeof condition.value === "string" &&
        condition.value.startsWith("@store.")
          ? resolveValue(
              condition.value,
              props,
              stateSnapshot,
              computedSnapshot,
            )
          : condition.value;
      return evaluateCondition({ ...condition, value: expectedValue }, value);
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

  if (!config.modifiers) {
    return baseProps;
  }

  // Get shared data from context
  // const shared = useShared();

  // Resolve modifier references using shared resolver
  // const resolvedModifiers = resolveModifiers(config.modifiers, shared);
  // const resolvedModifiers = resolveModifiers(config.modifiers);
  const resolvedModifiers = config.modifiers as Modifier[] | undefined;

  if (!resolvedModifiers || resolvedModifiers.length === 0) {
    return baseProps;
  }

  // Get snapshots for reactivity

  const stateSnapshot = store
    ? (useSnapshot(store.state) as Record<string, unknown>)
    : null;

  const computedSnapshot = store.computed
    ? (useSnapshot(store.computed) as Record<string, unknown>)
    : null;

  // Start with base props
  let modifiedProps = { ...baseProps };

  // Apply each matching modifier
  for (const modifier of resolvedModifiers) {
    // Type guard: only apply Modifier (not Modifier2)
    if (
      modifier &&
      "conditions" in modifier &&
      modifier.conditions.length > 0
    ) {
      const firstCondition = modifier.conditions[0];
      // Check if it's Modifier (has 'path') or Modifier2 (has 'store')
      if ("path" in firstCondition) {
        // It's a Modifier (old format)
        if (
          checkModifier(
            modifier as Modifier,
            baseProps,
            stateSnapshot,
            computedSnapshot,
          )
        ) {
          modifiedProps = mergeProps(modifiedProps, modifier.props);
          if (modifier.props.hide) {
            break;
          }
        }
      }
      // Skip Modifier2 - they should use modifiers2 field instead
    }
  }

  return modifiedProps;
}
