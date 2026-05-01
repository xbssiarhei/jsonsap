import { merge } from "lodash-es";
import type { AppConfig, Modifier, Modifier2, Any } from "../../types";
import { resolveModifiers } from "../modifiers";

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
  shared?: AppConfig<Any>["shared"],
): Any {
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
        return null;
      }
      return { ...modifier };
    }
    // Future categories can be added here
    default: {
      if (!shared[category]) {
        console.warn(`Unknown shared category: ${category}`);
        return null;
      }
      const sharedItem = shared[category][name];

      if (!sharedItem) {
        console.warn(`Unknown shared path: ${category} / ${name}`);
        return null;
      }
      if (Array.isArray(sharedItem)) {
        return sharedItem;
      }
      return { ...shared[category as keyof AppConfig<Any>["shared"]][name] };
      // return { ...shared[name] };
    }
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
  shared?: AppConfig<Any>["shared"],
): T {
  if (!config || !shared) return config;

  // Handle arrays
  if (Array.isArray(config)) {
    return config.map((item) => resolveSharedReferences(item, shared)) as T;
  }

  // Handle objects
  if (typeof config === "object") {
    // If ComponentConfig with @shared/components/ type — merge current config on top
    if ("type" in config && typeof (config as Any).type === "string") {
      const match = ((config as Any).type as string).match(
        /^@(?:shared\/)?components\/(.+)$/,
      );
      if (match) {
        const sharedComponent = shared?.components?.[match[1]];
        if (sharedComponent) {
          const base: Any = Array.isArray(sharedComponent)
            ? sharedComponent[0]
            : sharedComponent;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { type: _, ...overrides } = config as Any;
          const merged = merge({}, base, overrides);
          return resolveSharedReferences(merged, shared) as T;
        }
      }
    }

    const result: Any = {};

    for (const [key, value] of Object.entries(config)) {
      if (key === "store") {
        result[key] = value;
        continue;
      }
      // Special handling for modifiers field
      if (key === "modifiers" && value) {
        result[key] = resolveModifiers(
          value as
            | (Modifier | Modifier2 | string)[]
            | Modifier
            | Modifier2
            | string,
          shared,
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

  if (typeof config === "string" && config.startsWith("@shared/")) {
    return resolveSharedReference(config, shared) as T;
  }

  // Return primitives as-is
  return config;
}
