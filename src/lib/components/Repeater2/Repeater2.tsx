import { proxy, useSnapshot } from "valtio";
import { useRepeaterContext } from "../../plugins/repeater";
import { getNestedValue } from "../repeaterUtils";
import { RepeaterItemArray, RepeaterItem } from "./RepeaterItem";

const emptyProxy = proxy({});
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
  let proxyStore = emptyProxy;
  // Resolve @store.* path to get the actual data
  if (store?.startsWith("@store.") && context.store) {
    const rootPath = store;
    const path = rootPath.substring(7); // Remove "@store/" prefix
    const parts = path.split(".");
    const [section] = parts;
    snap = getNestedValue(context.store, parts);
    if (section !== "state") {
      proxyStore = context.store[section];
    }
  }
  // subscribe to update custom store
  useSnapshot(proxyStore);

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
