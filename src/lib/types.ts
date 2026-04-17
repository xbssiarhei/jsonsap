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

export interface SetAction {
  $action: "set";
  store?: string; // Optional store name (for future multi-store support)
  path: string; // Path in store state, e.g., "/firstName" or "user.name"
  value?: unknown; // Optional explicit value to set (can be @item.* reference)
  then?: string; // Optional action to call after setting value, e.g., "applyFilter"
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LibComponent<P = any> = ComponentType<P> | string | undefined;

export type ComponentRegistry = Map<string, LibComponent>;
export type PluginRegistry = Map<string, Plugin>;

export type DefaultState = Record<string, unknown>;

// JSONata computed property
export interface JSONataComputed {
  $jsonata: string; // JSONata expression
  source: string; // @store.state.* reference to data source
}

// Computed value can be a function or JSONata expression
export type ComputedValue<State> =
  | ((state: State) => unknown)
  | JSONataComputed;

// Store types
export interface StoreConfig<State = DefaultState> {
  state: State;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions?: Record<string, (state: State, ...args: any[]) => void>;
  computed?: Record<string, ComputedValue<State>>;
}

export interface AppConfig<State extends DefaultState> {
  store?: StoreConfig<State>;
  ui: ComponentConfig;
}

export interface StoreInstance {
  state: Record<string, unknown>;
  actions: Record<string, (...args: unknown[]) => void>;
  computed: Record<string, unknown>;
}
