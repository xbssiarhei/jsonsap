import type { ComponentConfig, PluginContext } from "@/lib/types";
import { createElement } from "react";
import { JsonRendererInternal } from "./main";

export function renderChildren(
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
    return children.map((child, index) => {
      if (typeof child === "string" || typeof child === "number") {
        return child;
      }
      return createElement(JsonRendererInternal, {
        key: index,
        config: child,
        context,
      });
    });
  }

  // Handle single component child
  return createElement(JsonRendererInternal, { config: children, context });
}
