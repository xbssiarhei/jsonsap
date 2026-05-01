import type {
  ComponentConfig,
  PluginContext,
  StoreInstance,
} from "@/lib/types";
import { createElement, type ReactElement } from "react";
import { componentRegistry } from "../registry";
import { pluginRegistry } from "../plugins";
import { resolveChildren } from "../resolver";
import { renderChildren } from "./children";
import type { createStore } from "../store";
import { applyConfigModifiers } from "../modifiers";

export function renderComponent(
  config: ComponentConfig,
  context: PluginContext,
): ReactElement | null {
  if (!config || !config.type) {
    return null;
  }

  // Get component metadata from registry
  const metadata = componentRegistry.get(config.type);
  if (!metadata || !metadata.component) {
    console.warn(`Component "${config.type}" not found in registry`);
    return null;
  }

  // Auto-inject required plugins if not already present
  let modifiedConfig = config;
  if (metadata.requiredPlugins && metadata.requiredPlugins.length > 0) {
    const currentPlugins = config.plugins || [];
    const missingPlugins = metadata.requiredPlugins.filter(
      (plugin) => !currentPlugins.includes(plugin),
    );

    if (missingPlugins.length > 0) {
      modifiedConfig = {
        ...config,
        plugins: [...currentPlugins, ...missingPlugins],
      };

      // Log in development mode
      if (import.meta.env.DEV) {
        console.info(
          `[${config.type}] Auto-injecting required plugins:`,
          missingPlugins,
        );
      }
    }
  }

  // Execute beforeRender plugins
  if (modifiedConfig.plugins && modifiedConfig.plugins.length > 0) {
    modifiedConfig = pluginRegistry.executeBeforeRender(
      modifiedConfig,
      modifiedConfig.plugins,
      context,
    );
  }

  // Get component from metadata (already validated above)
  let Component = metadata.component;

  if (
    modifiedConfig.children &&
    String(modifiedConfig.children).includes("@store")
  ) {
    modifiedConfig.children = resolveChildren(
      modifiedConfig.children,
      context.store as StoreInstance,
    );
  }

  // Render children
  const renderedChildren = renderChildren(modifiedConfig.children, {
    ...context,
    depth: context.depth + 1,
    parentType: modifiedConfig.type,
  });

  // Apply modifiers to get final props
  const store = context.store as ReturnType<typeof createStore> | null;
  const finalProps = applyConfigModifiers(
    modifiedConfig,
    store as unknown as StoreInstance,
  );

  // should hide element
  if (!finalProps) {
    return null;
  }

  // Execute wrapper (HOC) plugins
  if (modifiedConfig.plugins && modifiedConfig.plugins.length > 0) {
    Component = pluginRegistry.executeWrapComponent(
      Component,
      modifiedConfig,
      modifiedConfig.plugins,
      context,
    );

    if (!Component) {
      throw new Error(
        `Component is not defined for "${config.type}" after applying plugins`,
      );
    }
  }

  // Render slots
  const renderedSlots = modifiedConfig.slots
    ? Object.fromEntries(
        Object.entries(modifiedConfig.slots).map(([name, slotConfig]) => [
          name,
          renderChildren(slotConfig, {
            ...context,
            depth: context.depth + 1,
            parentType: modifiedConfig.type,
          }),
        ]),
      )
    : undefined;

  // Create element
  const propsWithSlots = renderedSlots
    ? { ...finalProps, slots: renderedSlots }
    : finalProps;
  let element = createElement(Component, propsWithSlots, renderedChildren);

  // Execute afterRender plugins
  if (modifiedConfig.plugins && modifiedConfig.plugins.length > 0) {
    element = pluginRegistry.executeAfterRender(
      element,
      modifiedConfig,
      modifiedConfig.plugins,
      context,
    );
  }

  return element;
}
