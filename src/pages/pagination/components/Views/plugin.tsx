import type { Plugin } from "@/lib";

export const viewsPlugin: Plugin = {
  name: "views",
  // beforeRender: (config, context) => {
  //   const indent = "  ".repeat(context.depth);
  //   console.log(`${indent}[Logger] Rendering: ${config.type}`, config, context);
  //   return config;
  // },
  // wrapComponent(Component, config, context) {
  //   console.log(1);

  //   return (props) => {
  //     return <Component {...props} />;
  //   };
  // },
};
