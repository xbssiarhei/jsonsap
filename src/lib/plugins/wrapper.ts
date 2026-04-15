import { createElement } from "react";
import type { Plugin } from "../types";

export const wrapperPlugin: Plugin = {
  name: "wrapper",
  afterRender: (element, config) => {
    return createElement(
      "div",
      {
        style: {
          padding: "8px",
          border: "1px dashed #ccc",
          margin: "4px",
          borderRadius: "4px",
        },
        "data-wrapper": config.type,
      },
      element,
    );
  },
};
