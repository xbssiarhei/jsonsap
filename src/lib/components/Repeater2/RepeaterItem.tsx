import { useSnapshot } from "valtio";
import { JsonRenderer, type ComponentConfig } from "../..";
import { resolveItemReferences } from "../repeaterUtils";

interface RepeaterItemProps {
  store: any;
  getId: (item: any) => unknown;
  id: string;
  template: ComponentConfig;
}

/**
 * RepeaterItemArray - Renders a single item from an Array
 *
 * Uses useSnapshot on the found item for selective re-rendering.
 * Only this component re-renders when the item changes.
 */
export function RepeaterItemArray({
  store,
  id,
  template,
  getId,
}: RepeaterItemProps) {
  // Find item and create reactive snapshot
  const item = useSnapshot(store.find((item) => getId(item) === id));

  // Resolve @item.* references in template
  return <RepeaterItem template={template} item={item} />;
}

/**
 * RepeaterItemMap - Renders a single item from a Map
 *
 * Uses useSnapshot on the Map.get(id) result for selective re-rendering.
 * Only this component re-renders when the item changes.
 */
export function RepeaterItemMap({ store, id, template }: RepeaterItemProps) {
  // Get item from Map and create reactive snapshot
  const item = useSnapshot(store.get(id));

  return <RepeaterItem template={template} item={item} />;
}

export function RepeaterItem({ item, template }) {
  // Resolve @item.* references in template
  const resolvedConfig = resolveItemReferences(template, item);
  return <JsonRenderer config={resolvedConfig as ComponentConfig} />;
}
