import { registerCommonComponents } from "./registerComponents";
import { registerCommonPlugins } from "./registerPlugins";

export { JsonRenderer } from "./renderer/";
export { componentRegistry } from "./registry";
export { pluginRegistry } from "./plugins";
export { createStore, subscribeToStore } from "./store";
export { StoreProvider, useStore } from "./StoreProvider";
export { useStoreState, useStoreActions, useStoreComputed } from "./storeHooks";
export { applyModifiers } from "./modifiers";
export { loggerPlugin } from "./plugins/logger";
export { wrapperPlugin } from "./plugins/wrapper";
export { autoBindPlugin } from "./plugins/autoBind";
export { repeaterPlugin } from "./plugins/repeater";
export { registerCommonComponents } from "./registerComponents";
export { registerCommonPlugins } from "./registerPlugins";
export type {
  ComponentConfig,
  Plugin,
  PluginContext,
  ComponentRegistry,
  PluginRegistry,
  StoreConfig,
  AppConfig,
  StoreInstance,
  Modifier,
  ModifierCondition,
} from "./types";

registerCommonComponents();
registerCommonPlugins();
