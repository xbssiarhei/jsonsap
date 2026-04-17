import { JsonRenderer, type ComponentConfig } from "..";

interface RepeaterProps {
  items: unknown[];
  itemConfig: {
    type: string;
    props?: Record<string, unknown>;
    children?: unknown;
  };
}

export function Repeater({ items, itemConfig }: RepeaterProps) {
  if (!items || !Array.isArray(items)) {
    return null;
  }

  return (
    <>
      {items.map((item, index) => {
        // Replace @item.* references in config with actual item values
        const resolvedConfig = resolveItemReferences(itemConfig, item);

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

// const patternHandler = /on[A-Z].*/;

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
    // const keys = Object.keys(config).sort((a, b) => {
    //   if (patternHandler.test(a)) return 1;
    //   if (patternHandler.test(b)) return -1;
    //   return 0;
    // });
    // for (const key of keys) {
    // const value = config[key];
    for (const [key, value] of Object.entries(config)) {
      // Special handling for props that should receive the whole item
      if (key === "item" && value === "@item") {
        resolved[key] = item;
      } else {
        resolved[key] = resolveItemReferences(value, item);
      }
    }
    return resolved;
  }

  return config;
}

function getNestedValue(obj: unknown, path: string[]): unknown {
  return path.reduce((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}
