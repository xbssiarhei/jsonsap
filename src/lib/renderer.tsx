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
import { SharedProvider } from "./SharedContext";
import { resolveChildren, useResolvedConfig } from "./resolver";
import { applyModifiers, applyModifiers2 } from "./modifiers";
import type { StoreInstance } from "./types";
import { Spinner } from "@/components/ui/spinner";
import { proxy, useSnapshot } from "valtio";
import { resolveSharedReferences } from "./sharedResolver";

interface JsonRendererProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: ComponentConfig | AppConfig<any>;
  context?: Partial<PluginContext>;
  store?: unknown;
}

interface JsonRendererRootProps extends JsonRendererProps {
  config: AppConfig<any>;
}

const emptyProxy = proxy({});

export function JsonRendererRoot({
  config,
  context = {},
}: JsonRendererRootProps): ReactElement | null {
  const [store, setStore] = useState<StoreInstance | null>(null);
  const state = useSnapshot(store ? store.state : emptyProxy);
  const mapVersion = (state as any)?.mapVersion;

  useEffect(() => {
    const appConfig = config as AppConfig<Record<string, unknown>>;
    if (appConfig.store) {
      createStore(appConfig.store!).then((storeInstance) => {
        setStore(storeInstance);
      });
    }
  }, [mapVersion]);

  if (!store) {
    return <Spinner />;
  }
  // resolve all shared references
  const resolvedConfig = resolveSharedReferences(config, config.shared);
  return (
    <SharedProvider shared={resolvedConfig.shared}>
      <StoreProvider store={store}>
        <JsonRenderer config={resolvedConfig.ui} context={context} />
      </StoreProvider>
    </SharedProvider>
  );
}

export function JsonRenderer({
  config,
  context = {},
  // store
}: JsonRendererProps): ReactElement | null {
  // Legacy: direct ComponentConfig
  return (
    <JsonRendererInternal
      config={config as ComponentConfig}
      context={context}
    />
  );
}

JsonRenderer.Root = JsonRendererRoot;

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
  const Component = metadata.component;

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
  const finalProps1 = applyModifiers(
    modifiedConfig,
    store as unknown as StoreInstance,
  );

  // should hide element
  if (finalProps1.hide) {
    return null;
  }

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
