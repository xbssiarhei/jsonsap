import type { ReactElement } from "react";
import type { JsonRendererInternalProps, JsonRendererProps } from "./types";
import type { ComponentConfig, PluginContext } from "@/lib/types";
import { useStore } from "../StoreProvider";
import { useResolvedConfig } from "../resolver";
import { renderComponent } from "./component";

export function JsonRenderer({
  config,
  context = {},
  // store
}: JsonRendererProps): ReactElement | null {
  // Legacy: direct ComponentConfig
  return (
    <JsonRendererInternal
      config={config as ComponentConfig}
      context={context}
    />
  );
}

export function JsonRendererInternal({
  config,
  context = {},
}: JsonRendererInternalProps): ReactElement | null {
  const store = useStore();

  const pluginContext: PluginContext = {
    depth: 0,
    store,
    ...context,
  };

  // Resolve store references if store exists
  const resolvedConfig = useResolvedConfig(config, store);

  return renderComponent(resolvedConfig, pluginContext);
}
