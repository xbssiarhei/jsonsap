import type { ReactElement, ComponentType } from "react";

export interface ModifierCondition {
  path: string; // e.g., "status", "item.status", "@store.state.theme"
  operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
  value: unknown;
}

export interface Modifier {
  conditions: ModifierCondition[];
  props: Record<string, unknown>; // Props to merge when conditions match
  matchAll?: boolean; // true = AND logic, false = OR logic (default: true)
}

export interface ComponentConfig {
  type: string;
  props?: Record<string, unknown>;
  children?: ComponentConfig[] | ComponentConfig | string | number;
  plugins?: string[];
  modifiers?: Modifier[]; // Conditional prop modifications
}

export interface PluginContext {
  depth: number;
  parentType?: string;
  [key: string]: unknown;
}

export interface Plugin {
  name: string;
  beforeRender?: (
    config: ComponentConfig,
    context: PluginContext,
  ) => ComponentConfig;
  afterRender?: (
    element: ReactElement,
    config: ComponentConfig,
    context: PluginContext,
  ) => ReactElement;
}

export type ComponentRegistry = Map<string, ComponentType<unknown>>;
export type PluginRegistry = Map<string, Plugin>;

// Store types
export interface StoreConfig {
  state: Record<string, unknown>;
  actions?: Record<
    string,
    (state: Record<string, unknown>, ...args: unknown[]) => void
  >;
  computed?: Record<string, (state: Record<string, unknown>) => unknown>;
}

export interface AppConfig {
  store?: StoreConfig;
  ui: ComponentConfig;
}

export interface StoreInstance {
  state: Record<string, unknown>;
  actions: Record<string, (...args: unknown[]) => void>;
  computed: Record<string, unknown>;
}
