import { useStore, type Plugin } from "@/lib";
import { getNestedValue } from "@/lib/components/repeaterUtils";
import { proxy, useSnapshot } from "valtio";
import { StoreProvider } from "./Context";
import { useProxyStore } from "../useProxyStore";

const emptyProxy = proxy({});

export const storePlugin: Plugin<{
  collectionPath: string;
  subscribe?: boolean;
}> = {
  name: "store",
  // beforeRender: (config, context) => {
  //   const indent = "  ".repeat(context.depth);
  //   console.log(`${indent}[Logger] Rendering: ${config.type}`, config.props);
  //   return config;
  // },
  wrapComponent: (Component, config) => {
    const { collectionPath, subscribe } = config;

    return ({ children, ...props }) => {
      const { storeItem } = useProxyStore(collectionPath);

      // Convert to array
      const items = Array.isArray(storeItem)
        ? storeItem
        : Array.from((storeItem as Map<unknown, unknown>).values());

      return (
        <StoreProvider value={{ items, storeItem }}>
          <Component items={items} storeItem={storeItem}>
            {children}
          </Component>
        </StoreProvider>
      );
    };
  },
};
