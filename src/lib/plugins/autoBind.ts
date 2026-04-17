import type { Plugin } from "../types";

/**
 * Auto-bind plugin for form inputs
 * Automatically binds input/select/textarea onChange handlers to store state
 *
 * Usage in JSON config:
 * {
 *   "type": "input",
 *   "props": {
 *     "value": "@store.state.username",
 *     "autoBind": "username"  // Will auto-create onChange handler
 *   }
 * }
 *
 * Or with nested paths:
 * {
 *   "type": "input",
 *   "props": {
 *     "value": "@store.state.user.email",
 *     "autoBind": "user.email"
 *   }
 * }
 */
export const autoBindPlugin: Plugin = {
  name: "autoBind",
  beforeRender: (config, context) => {
    // Check if component has autoBind prop
    if (!config.props || !("autoBind" in config.props)) {
      return config;
    }

    const isCheckbox = config.type === "Checkbox";
    const handlerName = isCheckbox ? "onCheckedChange" : "onChange";

    const autoBind = config.props.autoBind;
    if (typeof autoBind !== "string") {
      console.warn("autoBind prop must be a string path to store state");
      return config;
    }

    // Get store from context
    const store = context.store as
      | { state: Record<string, unknown> }
      | undefined;
    if (!store) {
      console.warn("autoBind requires store in context");
      return config;
    }

    // Create onChange handler that updates store state
    const onChange = (e: {
      target: { value: unknown; checked?: boolean; type?: string };
    }) => {
      const path = autoBind.split(".");
      let current = store.state;

      // Navigate to the parent object
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (!(key in current)) {
          (current as Record<string, unknown>)[key] = {};
        }
        current = (current as Record<string, unknown>)[key] as Record<
          string,
          unknown
        >;
      }

      // Set the value
      const lastKey = path[path.length - 1];

      // Handle checkbox inputs
      // if (e.target.type === "checkbox" && "checked" in e.target) {
      if (isCheckbox) {
        (current as Record<string, unknown>)[lastKey] = e;
      } else {
        (current as Record<string, unknown>)[lastKey] =
          e.target.type === "number" ? Number(e.target.value) : e.target.value;
      }
    };

    // Return modified config with onChange handler
    return {
      ...config,
      props: {
        ...config.props,
        [handlerName]: onChange,
        // Remove autoBind from final props
        autoBind: undefined,
      },
    };
  },
};
