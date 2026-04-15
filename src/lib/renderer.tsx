import { createElement, Fragment, type ReactElement } from "react";
import type { ComponentConfig, PluginContext } from "./types";
import { componentRegistry } from "./registry";
import { pluginRegistry } from "./plugins";

interface JsonRendererProps {
  config: ComponentConfig;
  context?: Partial<PluginContext>;
}

export function JsonRenderer({
  config,
  context = {},
}: JsonRendererProps): ReactElement | null {
  const pluginContext: PluginContext = {
    depth: 0,
    ...context,
  };

  return renderComponent(config, pluginContext);
}

function renderComponent(
  config: ComponentConfig,
  context: PluginContext,
): ReactElement | null {
  if (!config || !config.type) {
    return null;
  }

  // Execute beforeRender plugins
  let modifiedConfig = config;
  if (config.plugins && config.plugins.length > 0) {
    modifiedConfig = pluginRegistry.executeBeforeRender(
      config,
      config.plugins,
      context,
    );
  }

  // Get component from registry
  const Component = componentRegistry.get(modifiedConfig.type);
  if (!Component) {
    console.warn(`Component "${modifiedConfig.type}" not found in registry`);
    return null;
  }

  // Render children
  const renderedChildren = renderChildren(modifiedConfig.children, {
    ...context,
    depth: context.depth + 1,
    parentType: modifiedConfig.type,
  });

  // Create element
  let element = createElement(
    Component,
    modifiedConfig.props || {},
    renderedChildren,
  );

  // Execute afterRender plugins
  if (config.plugins && config.plugins.length > 0) {
    element = pluginRegistry.executeAfterRender(
      element,
      modifiedConfig,
      config.plugins,
      context,
    );
  }

  return element;
}

function renderChildren(
  children: ComponentConfig["children"],
  context: PluginContext,
): React.ReactNode {
  if (!children) {
    return null;
  }

  // Handle primitive children (string, number)
  if (typeof children === "string" || typeof children === "number") {
    return children;
  }

  // Handle array of children
  if (Array.isArray(children)) {
    return createElement(
      Fragment,
      null,
      ...children.map((child, index) => {
        if (typeof child === "string" || typeof child === "number") {
          return child;
        }
        return createElement(JsonRenderer, {
          key: index,
          config: child,
          context,
        });
      }),
    );
  }

  // Handle single component child
  return createElement(JsonRenderer, { config: children, context });
}
