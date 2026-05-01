import type { Any, AppConfig, Modifier, Modifier2 } from "../../types";
import { resolveSharedReference } from "../shared";

/**
 * Resolves modifiers array, handling both objects and @shared/* references
 *
 * @param modifiers - Can be:
 *   - Single Modifier object
 *   - Array of Modifier objects
 *   - Single string reference (@shared/modifiers/name)
 *   - Array of string references or mixed
 * @param shared - Shared data for resolving references
 * @returns Array of resolved Modifier objects
 */
export function resolveModifiers(
  modifiers:
    | (Modifier | Modifier2 | string)[]
    | Modifier
    | Modifier2
    | string
    | undefined,
  shared?: AppConfig<Any>["shared"],
): (Modifier | Modifier2)[] {
  if (!modifiers) return [];

  // Normalize to array
  const modifiersArray = Array.isArray(modifiers) ? modifiers : [modifiers];

  return modifiersArray
    .map((modifier) => {
      // If it's a string reference, resolve it
      if (typeof modifier === "string") {
        return resolveSharedReference(modifier, shared) as Modifier | Modifier2;
      }
      // Already a Modifier object
      return modifier;
    })
    .filter((m): m is Modifier | Modifier2 => m !== null);
}
