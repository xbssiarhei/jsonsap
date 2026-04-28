import type { Plugin } from "@/lib";
import { useState } from "react";
import { PaginationProvider } from "./Context";

export const paginationPlugin2: Plugin = {
  name: "pagination2",
  // beforeRender: function (config, context) {
  //   const indent = "  ".repeat(context.depth);
  //   console.log(
  //     `${indent}[Logger] Plugin ${this.name}: ${config.type}`,
  //     config.props,
  //   );
  //   return config;
  // },
  wrapComponent: (Component, config) => {
    return ({ children, items: itemsProp, ...props }) => {
      const [itemsPerPage, setItemsPerPage] = useState(3);
      const [page, setPage] = useState(1);

      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const allItems = itemsProp ?? config?.props?.items ?? [];
      const items = allItems.slice(start, end);

      return (
        <PaginationProvider
          value={{
            items: allItems,
            page,
            itemsPerPage,
            setPage,
            setItemsPerPage,
          }}
        >
          <Component {...{ ...config.props, ...props, items }}>
            {children}
          </Component>
        </PaginationProvider>
      );
    };
  },
};
