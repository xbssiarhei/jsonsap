import type { AppConfig } from "@/lib";

type TestState = {
  items: Array<{ id: number; name: string; value: number }>;
  viewMode: "list" | "cards" | "table";
};

const config: AppConfig<TestState> = {
  store: {
    state: {
      items: Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        value: Math.floor(Math.random() * 100),
      })),
      viewMode: "cards",
    },
  },
  ui: {
    type: "PageRoot",
    children: [
      {
        type: "h2",
        props: {
          className: "text-3xl font-bold mb-6",
        },
        children: "Pagination Test",
      },
      {
        type: "div",
        props: {
          className: "flex gap-4 items-center justify-between",
        },
        children: [
          {
            type: "div",
            props: {
              className: "flex gap-4 items-center",
            },
            children: [
              {
                type: "ButtonGroup",
                props: {
                  className: "py-4",
                },
                children: [
                  {
                    type: "Repeater",
                    props: {
                      items: [
                        { view: "cards", label: "Cards" },
                        { view: "list", label: "List" },
                        { view: "table", label: "Table" },
                      ],
                      template: {
                        type: "Button",
                        children: "@item.label",
                        props: {
                          variant: "outline",
                          onClick: {
                            $action: "set",
                            path: "viewMode",
                            value: "@item.view",
                          },
                        },
                        modifiers: [
                          {
                            conditions: [
                              {
                                path: "@store.state.viewMode",
                                operator: "equals",
                                value: "@item.view",
                              },
                            ],
                            props: {
                              variant: "default",
                            },
                          },
                        ],
                      },
                    },
                  },
                ],
              },
              {
                type: "span",
                children: "Selected view: @store.state.viewMode",
              },
            ],
          },
          {
            type: "ButtonGroup",
            children: [
              {
                type: "ButtonGroup.Text",
                props: { asChild: false },
                children: [
                  {
                    type: "label",
                    props: { htmlFor: "search" },
                    children: "Search",
                  },
                ],
              },
              {
                type: "Input",
                props: {
                  id: "search",
                  placeholder: "Type something here...",
                },
              },
            ],
          },
        ],
      },
      {
        type: "StoreCollection",
        // collection: "@store.state.items",
        plugins: ["pagination"],
        props: {
          pageSize: 10,
          collectionPath: "@store/state/items",
        },
        children: [
          {
            type: "div",
            props: {
              className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4",
            },
            children: [
              {
                type: "CollectionRepeater",
                props: {
                  template: {
                    type: "Card",
                    props: {
                      className: "p-4",
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          className: "flex justify-between items-center",
                        },
                        children: [
                          {
                            type: "span",
                            props: {
                              className: "font-semibold",
                            },
                            children: "@item.name",
                          },
                          {
                            type: "Badge",
                            children: " @item.value",
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },
};

export default config;
