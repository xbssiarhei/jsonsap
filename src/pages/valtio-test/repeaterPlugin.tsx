import type { Plugin } from "@/lib";

type RepeaterConfig = {
  store: unknown;
  template: unknown;
};

export const repeaterPlugin: Plugin<RepeaterConfig> = {
  name: "repeater",
  beforeRender: (config, context) => {
    const indent = "  ".repeat(context.depth);
    console.log(
      `${indent}[repeater] Rendering: ${config.type}`,
      config.props,
      context,
    );
    config.props = {
      ...config.props,
      store: config.store,
      template: config.template,
    };
    return config;
  },
};
