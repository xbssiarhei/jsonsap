import { JsonRenderer, type ComponentConfig } from "..";
import { resolveItemReferences } from "./repeaterUtils";

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
 * Repeater - Basic repeater component for rendering arrays
 *
 * @deprecated - Use Repeater2 for better performance with Valtio
 *
 * Features:
 * - Renders array items using a template
 * - Supports @item.* syntax for accessing item properties
 * - Full event handler support (onClick, onChange)
 * - String interpolation: "Item #@item.id: @item.name"
 *
 * Usage:
 * ```json
 * {
 *   "type": "Repeater",
 *   "props": {
 *     "items": "@store.state.items",
 *     "template": {
 *       "type": "Card",
 *       "props": {
 *         "title": "@item.name"
 *       }
 *     }
 *   }
 * }
 * ```
 */
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
            context={{
              item,
            }}
          />
        );
      })}
    </>
  );
}
