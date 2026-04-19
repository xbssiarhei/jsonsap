import { createContext, useContext, type ReactNode } from "react";
import type { AppConfig } from "./types";

/**
 * Context for shared resources (modifiers, styles, etc.)
 * Provides access to shared library throughout the component tree
 */
interface SharedContextValue {
  shared?: AppConfig<any>["shared"];
}

const SharedContext = createContext<SharedContextValue | null>(null);

/**
 * Provider component for shared resources
 */
export function SharedProvider({
  shared,
  children,
}: {
  shared?: AppConfig<any>["shared"];
  children: ReactNode;
}) {
  return (
    <SharedContext.Provider value={{ shared }}>
      {children}
    </SharedContext.Provider>
  );
}

/**
 * Hook to access shared resources
 * Returns shared data or undefined if not in SharedProvider
 */
export function useShared(): SharedContextValue["shared"] {
  const context = useContext(SharedContext);
  return context?.shared;
}
