import type { AppConfig, Modifier, Modifier2 } from "./types";

/**
 * Resolves @shared/* references from AppConfig
 * Pattern: @shared/category/name or @category/name (shorthand)
 *
 * Examples:
 * - @shared/modifiers/hideWhenEditing
 * - @modifiers/hideWhenEditing (shorthand)
 *
 * Future support:
 * - @shared/styles/name
 * - @shared/components/name
 */
export function resolveSharedReference(
  reference: string,
  appConfig?: AppConfig<any>,
): any {
  if (!reference.startsWith("@")) {
    return reference;
  }

  // Parse: @shared/modifiers/name or @modifiers/name
  const match = reference.match(/^@(?:shared\/)?(\w+)\/(.+)$/);
  if (!match) {
    console.warn(`Invalid shared reference: ${reference}`);
    return null;
  }

  const [, category, name] = match;

  switch (category) {
    case "modifiers": {
      const modifier = appConfig?.shared?.modifiers?.[name];
      if (!modifier) {
        console.warn(`Modifier "${name}" not found in shared.modifiers`);
      }
      return modifier;
    }
    // Future categories can be added here
    default:
      console.warn(`Unknown shared category: ${category}`);
      return null;
  }
}

/**
 * Resolves modifiers array, handling both objects and @shared/* references
 *
 * @param modifiers - Can be:
 *   - Single Modifier object
 *   - Array of Modifier objects
 *   - Single string reference (@shared/modifiers/name)
 *   - Array of string references or mixed
 * @param appConfig - Full app config for resolving references
 * @returns Array of resolved Modifier objects
 */
export function resolveModifiers(
  modifiers: (Modifier | Modifier2 | string)[] | Modifier | Modifier2 | string | undefined,
  appConfig?: AppConfig<any>,
): (Modifier | Modifier2)[] {
  if (!modifiers) return [];

  // Normalize to array
  const modifiersArray = Array.isArray(modifiers) ? modifiers : [modifiers];

  return modifiersArray
    .map((modifier) => {
      // If it's a string reference, resolve it
      if (typeof modifier === "string") {
        return resolveSharedReference(modifier, appConfig) as Modifier | Modifier2;
      }
      // Already a Modifier object
      return modifier;
    })
    .filter((m): m is Modifier | Modifier2 => m !== null);
}
