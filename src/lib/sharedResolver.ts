import type { AppConfig, Modifier, Modifier2 } from "./types";

/**
 * Resolves @shared/* references from shared data
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
  shared?: AppConfig<any>["shared"],
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
      const modifier = shared?.modifiers?.[name];
      if (!modifier) {
        console.warn(`Modifier "${name}" not found in shared.modifiers`);
      }
      return { ...modifier };
    }
    // Future categories can be added here
    default:
      console.warn(`Unknown shared category: ${category}`);
      return null;
  }
}

/**
 * Recursively resolves all @shared/* references in a config object
 * Walks through the entire config tree and replaces string references with actual objects
 *
 * @param config - AppConfig or ComponentConfig to process
 * @param shared - Shared data for resolving references
 * @returns Config with all @shared/* references resolved
 */
export function resolveSharedReferences<T>(
  config: T,
  shared?: AppConfig<any>["shared"],
): T {
  if (!config || !shared) return config;

  // Handle arrays
  if (Array.isArray(config)) {
    return config.map((item) => resolveSharedReferences(item, shared)) as T;
  }

  // Handle objects
  if (typeof config === "object") {
    const result: any = {};

    for (const [key, value] of Object.entries(config)) {
      // Special handling for modifiers field
      if (key === "modifiers" && value) {
        result[key] = resolveModifiers(
          value as (Modifier | Modifier2 | string)[] | Modifier | Modifier2 | string,
          shared
        );
      }
      // Handle string references in any field
      else if (typeof value === "string" && value.startsWith("@shared/")) {
        result[key] = resolveSharedReference(value, shared);
      }
      // Recursively process nested objects and arrays
      else if (typeof value === "object" && value !== null) {
        result[key] = resolveSharedReferences(value, shared);
      }
      // Keep primitive values as-is
      else {
        result[key] = value;
      }
    }

    return result as T;
  }

  // Return primitives as-is
  return config;
}

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
  shared?: AppConfig<any>["shared"],
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
