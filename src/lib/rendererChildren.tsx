import type { ComponentConfig, PluginContext } from "@/lib/types";
import { createElement } from "react";
// import { Fragment } from "react/jsx-runtime";
import { JsonRendererInternal } from "./renderer";

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
    // return createElement(
    //   Fragment,
    //   null,
    //   ...children.map((child, index) => {
    //     if (typeof child === "string" || typeof child === "number") {
    //       return child;
    //     }
    //     return createElement(JsonRendererInternal, {
    //       key: index,
    //       config: child,
    //       context,
    //     });
    //   }),
    // );
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
