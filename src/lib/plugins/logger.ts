import type { Plugin } from "../types";

export const loggerPlugin: Plugin = {
  name: "logger",
  beforeRender: (config, context) => {
    const indent = "  ".repeat(context.depth);
    console.log(`${indent}[Logger] Rendering: ${config.type}`, config.props);
    return config;
  },
};
