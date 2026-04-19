import type { ComponentConfig, Plugin, PluginContext } from "@/lib";
import { createContext, useContext } from "react";

/**
 * Configuration for components using the repeater plugin
 */
type RepeaterConfig = {
  store: unknown;
  template: ComponentConfig;
};

/**
 * Context value provided by RepeaterProvider
 * Contains store path, template config, and plugin context
 */
interface RepeaterContextValue {
  store: string;
  template: ComponentConfig;
  context: PluginContext;
}

const RepeaterProvider = createContext<RepeaterContextValue | null>(null);

/**
 * Repeater Plugin - Enables Repeater2 component with context-based data passing
 *
 * Purpose:
 * - Provides store path and template to Repeater2 via React context
 * - Avoids passing complex data through JSON config
 * - Supports migration from v1 Repeater (items/template props) to v2 (store/template)
 *
 * Lifecycle:
 * 1. beforeRender: Migrates v1 config (props.items/template) to v2 (store/template)
 * 2. afterRender: Wraps component in RepeaterProvider with store, template, and context
 *
 * Usage in config:
 * {
 *   type: "Repeater2",
 *   plugins: ["repeater"],
 *   store: "@store.state.items",
 *   template: { ... }
 * }
 */
export const repeaterPlugin: Plugin<RepeaterConfig> = {
  name: "repeater",
  beforeRender: (config, context) => {
    const indent = "  ".repeat(context.depth);
    console.log(
      `${indent}[repeater] Rendering: ${config.type}`,
      config.props,
      context,
    );

    // Migration from v1 to v2
    // v1: { props: { items: [...], template: {...} } }
    // v2: { store: "@store.state.items", template: {...} }
    if (config?.props?.items && config?.props?.template) {
      config.store = config.props.items as string;
      config.template = config.props.template as ComponentConfig;

      // Optionally clean up old props (commented out to maintain backward compatibility)
      // delete config.props.items;
      // delete config.props.template;
    }
    return config;
  },
  afterRender(element, config, context) {
    return (
      <RepeaterProvider.Provider
        value={{
          store: config.store as string,
          template: config.template,
          context,
        }}
      >
        {element}
      </RepeaterProvider.Provider>
    );
  },
};

/**
 * Hook to access repeater context
 *
 * Must be called within a component wrapped by repeaterPlugin's RepeaterProvider.
 * Used by Repeater2 to get store path, template, and plugin context.
 *
 * @throws Error if called outside RepeaterProvider
 * @returns RepeaterContextValue with store, template, and context
 */
export const useRepeaterContext = (): RepeaterContextValue => {
  const context = useContext(RepeaterProvider);
  if (!context) {
    throw new Error("useRepeaterContext must be used within RepeaterProvider");
  }
  return context;
};
