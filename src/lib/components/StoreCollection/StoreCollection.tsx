import { proxy, useSnapshot } from "valtio";
import { getNestedValue } from "../repeaterUtils";
import { CollectionProvider } from "./StoreCollectionContext";
import { useStore } from "@/lib/StoreProvider";
import type { ComponentConfig } from "@/lib/types";

const emptyProxy = proxy({});

type StoreCollectionProps = {
  collectionPath: string;
  keyIdPath?: string | string[];
  template?: ComponentConfig;
  children?: React.ReactNode;
  _paginationState?: {
    page: number;
    pageSize: number;
  };
};

export function StoreCollection({
  collectionPath = "@store/state/items",
  keyIdPath = "id",
  template,
  children,
  _paginationState,
}: StoreCollectionProps) {
  let snap = null;
  let proxyStore = emptyProxy;

  // Get store from context
  const storeInstance = useStore();

  // Resolve @store.* path to get the actual data
  if (collectionPath?.startsWith("@store") && storeInstance) {
    const path = collectionPath.substring(7); // Remove "@store." prefix
    const parts = path.split("/");
    const [section] = parts;
    snap = getNestedValue(storeInstance, parts);
    if (section !== "state") {
      proxyStore = storeInstance[section];
    }
  }

  // Subscribe to updates
  useSnapshot(proxyStore);

  if (!snap) {
    return null;
  }

  // Convert to array
  let collection = Array.isArray(snap)
    ? snap
    : Array.from((snap as Map<unknown, unknown>).values());

  // Apply pagination if provided
  if (_paginationState) {
    const { page, pageSize } = _paginationState;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    collection = collection.slice(start, end);
  }

  // getId function
  const keyPath = Array.isArray(keyIdPath) ? keyIdPath : [keyIdPath];
  const getId = (item: unknown) =>
    getNestedValue(item, keyPath) as string | number;

  return (
    <CollectionProvider value={{ collection, getId, template }}>
      {children}
    </CollectionProvider>
  );
}
