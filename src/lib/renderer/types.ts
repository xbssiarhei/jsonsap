import type { AppConfig, ComponentConfig, PluginContext } from "@/lib/types";

export interface JsonRendererProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: ComponentConfig | AppConfig<any>;
  context?: Partial<PluginContext>;
  store?: unknown;
}

export interface JsonRendererInternalProps {
  config: ComponentConfig;
  context?: Partial<PluginContext>;
}
