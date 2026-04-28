import { createContext, useContext } from "react";

export interface StoreContextValue {
  items: unknown[];
  storeItem: unknown;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export const StoreProvider = StoreContext.Provider;

export function useStoreContext(): StoreContextValue {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("usePaginationContext must be used within StoreProvider");
  }
  return context;
}
