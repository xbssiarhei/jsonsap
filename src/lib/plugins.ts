import { type ReactElement } from "react";
import type {
  Plugin,
  ComponentConfig,
  PluginContext,
  PluginRegistry,
} from "./types";

class PluginManager {
  private plugins: PluginRegistry = new Map();

  register(plugin: Plugin): void {
    this.plugins.set(plugin.name, plugin);
  }

  get(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  has(name: string): boolean {
    return this.plugins.has(name);
  }

  unregister(name: string): boolean {
    return this.plugins.delete(name);
  }

  executeBeforeRender(
    config: ComponentConfig,
    pluginNames: string[],
    context: PluginContext,
  ): ComponentConfig {
    let modifiedConfig = { ...config };

    for (const pluginName of pluginNames) {
      const plugin = this.plugins.get(pluginName);
      if (plugin?.beforeRender) {
        modifiedConfig = plugin.beforeRender(modifiedConfig, context);
      }
    }

    return modifiedConfig;
  }

  executeAfterRender(
    element: ReactElement,
    config: ComponentConfig,
    pluginNames: string[],
    context: PluginContext,
  ): ReactElement {
    let modifiedElement = element;

    for (const pluginName of pluginNames) {
      const plugin = this.plugins.get(pluginName);
      if (plugin?.afterRender) {
        modifiedElement = plugin.afterRender(modifiedElement, config, context);
      }
    }

    return modifiedElement;
  }
}

export const pluginRegistry = new PluginManager();
