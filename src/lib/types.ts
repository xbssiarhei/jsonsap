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

// Store reference for modifiers2 reactive subscriptions
export interface StoreRef {
  store: string; // Root proxy path (e.g., "@store/state")
  path: string; // Path within the proxy (e.g., "threshold")
}

// Condition type for modifiers2 with reactive store references
export interface ModifierCondition2 {
  store: StoreRef; // Store reference for reactive subscription
  operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
  value: StoreRef | unknown; // Can be StoreRef or primitive value
}

export interface Modifier2 {
  conditions: ModifierCondition2[];
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

export interface CallAction {
  $action: "call";
  name: string; // Action name to call, e.g., "moveTask"
  args?: unknown[]; // Array of arguments (can include @item.* references)
  params?: Record<string, unknown>; // Named parameters (can include @item.* references)
}

export type ActionConfig = SetAction | CallAction | string;

export interface ComponentConfig {
  type: string;
  props?: Record<string, unknown>;
  children?: ComponentConfig[] | ComponentConfig | string | number;
  plugins?: string[];
  modifiers?: Modifier[]; // Conditional prop modifications (old format)
  modifiers2?: Modifier2[]; // Conditional prop modifications (new reactive format)
}

export interface PluginContext {
  depth: number;
  parentType?: string;
  [key: string]: unknown;
}

export interface Plugin<T = object> {
  name: string;
  beforeRender?: (
    config: ComponentConfig & T,
    context: PluginContext,
  ) => ComponentConfig;
  afterRender?: (
    element: ReactElement,
    config: ComponentConfig & T,
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
