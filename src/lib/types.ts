import { ReactElement, ComponentType } from 'react';

export interface ComponentConfig {
  type: string;
  props?: Record<string, unknown>;
  children?: ComponentConfig[] | ComponentConfig | string | number;
  plugins?: string[];
}

export interface PluginContext {
  depth: number;
  parentType?: string;
  [key: string]: unknown;
}

export interface Plugin {
  name: string;
  beforeRender?: (config: ComponentConfig, context: PluginContext) => ComponentConfig;
  afterRender?: (element: ReactElement, config: ComponentConfig, context: PluginContext) => ReactElement;
}

export type ComponentRegistry = Map<string, ComponentType<unknown>>;
export type PluginRegistry = Map<string, Plugin>;
