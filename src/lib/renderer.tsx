import {
  createElement,
  Fragment,
  type ReactElement,
  useState,
  useEffect,
} from "react";
import type { ComponentConfig, PluginContext, AppConfig } from "./types";
import { componentRegistry } from "./registry";
import { pluginRegistry } from "./plugins";
import { createStore } from "./store";
import { StoreProvider, useStore } from "./StoreProvider";
import { resolveChildren, useResolvedConfig } from "./resolver";
import { applyModifiers, applyModifiers2 } from "./modifiers";
import type { StoreInstance } from "./types";
import { Spinner } from "@/components/ui/spinner";

interface JsonRendererProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: ComponentConfig | AppConfig<any>;
  context?: Partial<PluginContext>;
  store?: unknown;
}

export function JsonRenderer({
  config,
  context = {},
  // store
}: JsonRendererProps): ReactElement | null {
  // Check if config has store (AppConfig) or is just ComponentConfig
  const isAppConfig = "ui" in config || "store" in config;
  const [store, setStore] = useState<StoreInstance | null>(null);

  useEffect(() => {
    const appConfig = config as AppConfig<Record<string, unknown>>;
    if (appConfig.store) {
      createStore(appConfig.store!).then((storeInstance) => {
        setStore(storeInstance);
      });
    }
  }, []);

  if (isAppConfig) {
    const appConfig = config as AppConfig<Record<string, unknown>>;

    // Create store if provided
    if (appConfig.store) {
      if (!store) {
        return <Spinner />;
      }

      return (
        <StoreProvider store={store}>
          <JsonRendererInternal config={appConfig.ui} context={context} />
        </StoreProvider>
      );
    }

    // No store, just render UI
    return <JsonRendererInternal config={appConfig.ui} context={context} />;
  }

  // Legacy: direct ComponentConfig
  return (
    <JsonRendererInternal
      config={config as ComponentConfig}
      context={context}
    />
  );
}

interface JsonRendererInternalProps {
  config: ComponentConfig;
  context?: Partial<PluginContext>;
}

function JsonRendererInternal({
  config,
  context = {},
}: JsonRendererInternalProps): ReactElement | null {
  const store = useStore();

  const pluginContext: PluginContext = {
    depth: 0,
    store,
    ...context,
  };

  // Resolve store references if store exists
  const resolvedConfig = useResolvedConfig(config, store);

  return renderComponent(resolvedConfig, pluginContext);
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

  if (
    modifiedConfig.children &&
    String(modifiedConfig.children).includes("@store")
  ) {
    console.log(modifiedConfig);
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
  const finalProps1 = applyModifiers(
    modifiedConfig,
    store as unknown as StoreInstance,
  );

  const finalProps = applyModifiers2(
    {
      ...modifiedConfig,
      props: finalProps1,
    },
    store as unknown as StoreInstance,
  );

  // Create element
  let element = createElement(Component, finalProps, renderedChildren);

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
        return createElement(JsonRendererInternal, {
          key: index,
          config: child,
          context,
        });
      }),
    );
  }

  // Handle single component child
  return createElement(JsonRendererInternal, { config: children, context });
}
