import { useSnapshot } from "valtio";
import { JsonRenderer, type ComponentConfig } from "..";
import { useRepeaterContext } from "../plugins/repeater";

interface RepeaterProps {
  items: unknown[];
  template: {
    type: string;
    props?: Record<string, unknown>;
    children?: unknown;
  };
  store?: any;
}

/**
 * Repeater2 - Optimized repeater component with selective re-rendering
 *
 * Key features:
 * - Uses context from repeaterPlugin instead of direct props
 * - Supports both Array and Map data structures
 * - Selective re-rendering: only changed items re-render
 * - Uses @store.* syntax to access store data
 *
 * Architecture:
 * 1. Get store path and template from context
 * 2. Resolve store path to get proxy object (Array or Map)
 * 3. Render separate component for each item
 * 4. Each item component calls useSnapshot on individual item
 * 5. When item changes, only that item's component re-renders
 */
export function Repeater2() {
  let snap = null;
  const { store, template, context } = useRepeaterContext();

  // Resolve @store.* path to get the actual data
  if (store?.startsWith("@store.") && context.store) {
    const rootPath = store;
    const path = rootPath.substring(7); // Remove "@store/" prefix
    const parts = path.split(".");
    snap = getNestedValue(context.store, parts);
  }

  if (!snap) {
    return null;
  }

  // Detect data structure type and extract items
  const isArray = Array.isArray(snap);
  const items = isArray
    ? snap
    : (Array.from(snap?.values() ?? {}) as { id: string }[]);

  if (!snap) {
    return null;
  }

  // Choose appropriate item component based on data structure
  const Item = isArray ? RepeaterItemArray : RepeaterItem;

  return (
    <>
      {items.map((item) => {
        return (
          <Item key={item.id} template={template} store={snap} id={item.id} />
        );
      })}
    </>
  );
}

/**
 * RepeaterItemArray - Renders a single item from an Array
 *
 * Uses useSnapshot on the found item for selective re-rendering.
 * Only this component re-renders when the item changes.
 */
function RepeaterItemArray({ store, id, template }) {
  // Find item and create reactive snapshot
  const item = useSnapshot(store.find((item) => item.id === id));

  // Resolve @item.* references in template
  const resolvedConfig = resolveItemReferences(template, item);
  return <JsonRenderer config={resolvedConfig as ComponentConfig} />;
}

/**
 * RepeaterItem - Renders a single item from a Map
 *
 * Uses useSnapshot on the Map.get(id) result for selective re-rendering.
 * Only this component re-renders when the item changes.
 */
function RepeaterItem({ store, id, template }) {
  // Get item from Map and create reactive snapshot
  const item = useSnapshot(store.get(id));

  // Resolve @item.* references in template
  const resolvedConfig = resolveItemReferences(template, item);
  return <JsonRenderer config={resolvedConfig as ComponentConfig} />;
}

// old version
// @deprecated - Use Repeater2 for better performance with Valtio
export function Repeater({ items, template }: RepeaterProps) {
  if (!items || !Array.isArray(items)) {
    return null;
  }

  return (
    <>
      {items.map((item, index) => {
        // Replace @item.* references in config with actual item values
        const resolvedConfig = resolveItemReferences(template, item);

        return (
          <JsonRenderer
            key={
              typeof item === "object" && item !== null && "id" in item
                ? (item as { id: string }).id
                : index
            }
            config={resolvedConfig as ComponentConfig}
          />
        );
      })}
    </>
  );
}

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
function resolveItemReferences(config: unknown, item: unknown): unknown {
  if (typeof config === "string") {
    // Replace @item.* references
    if (config.startsWith("@item.")) {
      const path = config.substring(6); // Remove '@item.'
      return getNestedValue(item, path.split("."));
    }
    // Support string interpolation
    if (config.includes("@item.")) {
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
function getNestedValue(obj: unknown, path: string[]): unknown {
  return path.reduce((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}
