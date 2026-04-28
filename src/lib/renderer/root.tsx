import { proxy, useSnapshot } from "valtio";
import type { JsonRendererProps } from "./types";
import type { AppConfig, StoreInstance } from "@/lib/types";
import { useEffect, useState, type ReactElement } from "react";
import { createStore } from "../store";
import { Spinner } from "@/components/ui/spinner";
import { resolveSharedReferences } from "../sharedResolver";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { SharedProvider } from "../SharedContext";
import { StoreProvider } from "../StoreProvider";
import { JsonRenderer } from "./main";

interface JsonRendererRootProps extends JsonRendererProps {
  config: AppConfig<any>;
}

const emptyProxy = proxy({});

export function JsonRendererRoot({
  config,
  context = {},
}: JsonRendererRootProps): ReactElement | null {
  const [store, setStore] = useState<StoreInstance | null>(null);
  const state = useSnapshot(store ? store.state : emptyProxy);
  const mapVersion = (state as any)?.mapVersion;

  useEffect(() => {
    const appConfig = config as AppConfig<Record<string, unknown>>;
    if (appConfig.store) {
      createStore(appConfig.store!).then((storeInstance) => {
        setStore(storeInstance);
      });
    }
  }, [mapVersion]);

  if (!store) {
    return <Spinner />;
  }
  // resolve complex shared references
  const resolvedShared = resolveSharedReferences(config.shared, config.shared);
  // resolve all shared references
  const resolvedConfig = resolveSharedReferences(config, resolvedShared);
  return (
    <ErrorBoundary>
      <SharedProvider shared={resolvedConfig.shared}>
        <StoreProvider store={store}>
          <JsonRenderer config={resolvedConfig.ui} context={context} />
        </StoreProvider>
      </SharedProvider>
    </ErrorBoundary>
  );
}
