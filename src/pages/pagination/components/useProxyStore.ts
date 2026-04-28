import { useStore } from "@/lib";
import { getNestedValue } from "@/lib/components/repeaterUtils";
import { proxy, useSnapshot } from "valtio";

const emptyProxy = proxy({});

export const useProxyStore = (path: string, subscribe?: boolean) => {
  let storeItem = null;
  let proxyStore = emptyProxy;

  // Get store from context
  const storeInstance = useStore();

  // Resolve @store.* path to get the actual data
  if (path?.startsWith("@store") && storeInstance) {
    const _path = path.substring(7); // Remove "@store." prefix
    const parts = _path.split("/");
    const [section] = parts;
    storeItem = getNestedValue(storeInstance, parts);
    if (subscribe) {
      proxyStore = storeInstance[section];
    }
  }

  // Subscribe to updates
  useSnapshot(proxyStore);

  return {
    storeItem,
    proxyStore,
  };
};
