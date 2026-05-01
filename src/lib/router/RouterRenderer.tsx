import { useEffect, useState } from "react";
import { Routes, Route, Outlet, Link, NavLink } from "react-router";
import { proxy, useSnapshot } from "valtio";
import { createStore } from "../store";
import { resolveSharedReferences, SharedProvider } from "../resolvers/shared";
import { StoreProvider } from "../StoreProvider";
import { JsonRenderer } from "../renderer/main";
import { Spinner } from "@/components/ui/spinner";
import { componentRegistry } from "../registry";
import type { RouterAppConfig, RouteConfig } from "./types";
import type { StoreInstance } from "../types";

declare module "@/lib/types" {
  export interface ComponentConfigType {
    Outlet: string;
    Link: string;
    NavLink: string;
  }
}

componentRegistry.register("Outlet", Outlet);
componentRegistry.register("Link", Link);
componentRegistry.register("NavLink", NavLink);

const emptyProxy = proxy({});

function buildRoutes(
  routes: RouteConfig[],
  layouts?: Record<string, any>,
): React.ReactNode[] {
  return routes.map((route, i) => {
    if (route.layout && route.children) {
      const layoutConfig = layouts?.[route.layout];
      return (
        <Route
          key={i}
          path={route.path}
          element={
            layoutConfig ? <JsonRenderer config={layoutConfig} /> : <Outlet />
          }
        >
          {buildRoutes(route.children, layouts)}
        </Route>
      );
    }

    if (route.ui) {
      return (
        <Route
          key={i}
          path={route.path}
          index={route.index}
          element={<JsonRenderer config={route.ui} />}
        />
      );
    }

    return null;
  });
}

export function RouterRenderer({ config }: { config: RouterAppConfig }) {
  const [store, setStore] = useState<StoreInstance | null>(null);
  const state = useSnapshot(store ? store.state : emptyProxy);
  const mapVersion = (state as any)?.mapVersion;

  useEffect(() => {
    createStore(config.store ?? { state: {} }).then(setStore);
  }, [mapVersion]);

  if (!store) return <Spinner />;

  const resolvedShared = resolveSharedReferences(config.shared, config.shared);
  const resolvedConfig = resolveSharedReferences(config, resolvedShared);

  return (
    <SharedProvider shared={resolvedConfig.shared}>
      <StoreProvider store={store}>
        <Routes>
          {buildRoutes(resolvedConfig.routes, resolvedConfig.layouts)}
        </Routes>
      </StoreProvider>
    </SharedProvider>
  );
}
