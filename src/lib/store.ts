import { proxy, subscribe } from "valtio";
import { derive } from "derive-valtio";
import type { StoreConfig, StoreInstance } from "./types";

export function createStore(config: StoreConfig): StoreInstance {
  // Create reactive state with Valtio proxy
  const state = proxy(config.state);

  // Bind actions to state
  const actions: Record<string, (...args: unknown[]) => void> = {};
  if (config.actions) {
    Object.entries(config.actions).forEach(([name, actionFn]) => {
      actions[name] = (...args: unknown[]) => {
        actionFn(state, ...args);
      };
    });
  }

  // Create computed properties using derive-valtio
  let computed: Record<string, unknown> = {};
  if (config.computed) {
    const computedGetters: Record<
      string,
      (get: (obj: unknown) => unknown) => unknown
    > = {};

    Object.entries(config.computed).forEach(([name, computeFn]) => {
      computedGetters[name] = (get) => {
        const snapshot = get(state);
        return computeFn(snapshot as Record<string, unknown>);
      };
    });

    // @ts-expect-error skip error
    computed = derive(computedGetters);
  }

  return {
    state,
    actions,
    computed,
  };
}

export function subscribeToStore(
  store: StoreInstance,
  callback: () => void,
): () => void {
  return subscribe(store.state, callback);
}
