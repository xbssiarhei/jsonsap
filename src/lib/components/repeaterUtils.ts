/**
 * Resolves @item.* references in config with actual item values
 *
 * Supports:
 * - Direct references: "@item.name" -> item.name
 * - Nested paths: "@item.user.email" -> item.user.email
 * - String interpolation: "Hello @item.name" -> "Hello John"
 * - Special case: item: "@item" -> passes entire item object
 *
 * @param config - Configuration object/string/array to resolve
 * @param item - The item data to resolve references from
 * @returns Resolved configuration with @item.* replaced by actual values
 */
export function resolveItemReferences(config: unknown, item: unknown): unknown {
  if (typeof config === "string") {
    if (config.includes("@item.")) {
      const isMoreThanOne = (config.match(/@item\b/g) || []).length > 1;
      // Replace @item.* references
      if (!isMoreThanOne && config.startsWith("@item.")) {
        const path = config.substring(6); // Remove '@item.'
        return getNestedValue(item, path.split("."));
      }
      // Support string interpolation
      // Replace @item.* some text and @item.*
      return config.replace(/@item\.([\w.]+)/g, (_match, path) => {
        const value = getNestedValue(item, path.split("."));
        return String(value ?? "");
      });
    }
    return config;
  }

  if (Array.isArray(config)) {
    return config.map((child) => resolveItemReferences(child, item));
  }

  if (typeof config === "object" && config !== null) {
    const resolved: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(config)) {
      // Special handling for props that should receive the whole item
      if (key === "item" && value === "@item") {
        resolved[key] = item;
      } else {
        // Recursively resolve all values, including nested objects
        resolved[key] = resolveItemReferences(value, item);
      }
    }
    return resolved;
  }

  return config;
}

/**
 * Gets nested value from an object by following a path array
 *
 * @param obj - The object to traverse
 * @param path - Array of keys to follow (e.g., ["user", "name"])
 * @returns The value at the path, or undefined if not found
 */
export function getNestedValue(obj: unknown, path: string[]): unknown {
  return path.reduce((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}
