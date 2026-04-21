import { createContext, useContext } from "react";

export interface CollectionContextValue {
  collection: unknown[];
  getId: (item: unknown) => string | number;
  template: unknown;
}

const CollectionContext = createContext<CollectionContextValue | null>(null);

export const CollectionProvider = CollectionContext.Provider;

export function useCollectionContext(): CollectionContextValue {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error("useCollectionContext must be used within CollectionProvider");
  }
  return context;
}
