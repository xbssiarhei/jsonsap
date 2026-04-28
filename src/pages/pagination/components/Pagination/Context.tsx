import { createContext, useContext } from "react";

export interface PaginationContextValue {
  items: unknown[];
  page: number;
  itemsPerPage: number;
  setPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
}

const PaginationContext = createContext<PaginationContextValue | null>(null);

export const PaginationProvider = PaginationContext.Provider;

export function usePaginationContext(): PaginationContextValue {
  const context = useContext(PaginationContext);
  if (!context) {
    throw new Error(
      "usePaginationContext must be used within PaginationProvider",
    );
  }
  return context;
}
