import { createContext, useContext, type ReactNode } from "react";
import type { StoreInstance } from "./types";

const StoreContext = createContext<StoreInstance | null>(null);

interface StoreProviderProps {
  store: StoreInstance;
  children: ReactNode;
}

export function StoreProvider({ store, children }: StoreProviderProps) {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore(): StoreInstance | null {
  return useContext(StoreContext);
}
