import type { RouteConfig } from "@/lib/router";

export const live: RouteConfig = {
  path: "live",
  ui: {
    type: "div",
    props: { className: "flex flex-row gap-0 h-full" },
    children: [
      {
        type: "div",
        props: { className: "flex flex-col w-80 border-r shrink-0" },
        children: [
          {
            type: "div",
            props: {
              className: "border-b p-4 text-sm",
            },
            children: "@shared/components/tabsConfig",
          },
          {
            type: "div",
            props: {
              className: "p-0 flex flex-col gap-0 overflow-auto",
            },
            children: Array.from(new Array(15)).map(() => ({
              type: "div",
              children: "@shared/components/ItemCard",
              props: {
                // className: "gap-1 shrink-0 py-2",
                className: "border-b",
              },
              // children: [
              //   { type: "CardHeader", children: "Header" },
              //   { type: "CardContent", children: "Content" },
              // ],
            })),
            // children: Array.from(new Array(15)).map(() => ({
            //   type: "div",
            //   props: {
            //     className: "gap-1 shrink-0 py-2 border-b",
            //   },
            //   children: [
            //     { type: "CardHeader", children: "Header" },
            //     { type: "CardContent", children: "Content" },
            //   ],
            // })),
          },
        ],
      },
      {
        type: "div",
        props: { className: "w-full" },
        children: "Map",
      },
    ],
  },
};
