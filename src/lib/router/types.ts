import type { ComponentConfig, StoreConfig, DefaultState } from "@/lib/types";

export interface RouteConfig {
  path?: string;
  index?: boolean;
  layout?: string;
  ui?: ComponentConfig;
  children?: RouteConfig[];
}

export interface RouterAppConfig<State extends DefaultState = DefaultState> {
  shared?: {
    modifiers?: Record<string, any>;
    components?: Record<string, ComponentConfig | ComponentConfig[]>;
  };
  store?: StoreConfig<State>;
  layouts?: Record<string, ComponentConfig>;
  routes: RouteConfig[];
}
