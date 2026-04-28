import { type AppConfig, type StoreConfig } from "@/lib";
import "./components";
import { proxy } from "valtio";

type TestState = {
  items: Array<{ id: number; name: string; value: number }>;
  viewMode: "list" | "cards" | "table";
};

const store: StoreConfig<TestState> = {
  state: proxy({
    items: Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `Item store ${i + 1}`,
      value: Math.floor(Math.random() * 100),
    })),
    viewMode: "cards",
  }),
};

setInterval(() => {
  store.state.items.forEach((item) => {
    item.value = Math.floor(Math.random() * 100);
  });
}, 1000);

const config: AppConfig<TestState> = {
  store: store,
  shared: {
    components: {
      card: {
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
                  className: "font-semibolds",
                },
                children: [
                  {
                    type: "span",
                    props: {
                      className: "font-semibold",
                    },
                    children: "Name: ",
                  },
                  { type: "span", children: "@item.name" },
                ],
              },
              {
                type: "Badge",
                children: " @item.value",
              },
            ],
          },
        ],
      },
      viewModeButton: {
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
      viewModeText: [
        {
          type: "span",
          children: "Selected view: ",
        },
        {
          type: "Badge",
          props: {
            variant: "secondary",
          },
          children: "@store.state.viewMode",
        },
      ],
      searchInput: {
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
                      template: "@shared/components/viewModeButton",
                    },
                  },
                ],
              },
              {
                type: "span",
                children: "@shared/components/viewModeText",
              },
            ],
          },
          {
            type: "Fragment",
            children: "@shared/components/searchInput",
          },
        ],
      },
      {
        type: "div",
        props: {
          className: "flex flex-col gap-4 py-4",
        },
        children: [
          {
            type: "div",
            props: {
              className: "flex flex-col gap-4",
            },
            children: [
              {
                type: "div",
                children: "Example views",
              },
              {
                type: "Store",
                plugins: ["pagination2"],
                collectionPath: "@store/state/items",
                children: [
                  {
                    type: "Views",
                    props: {
                      view: "@store.state.viewMode",
                      views: {
                        cards: {
                          type: "Items",
                          props: {
                            className:
                              "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4",
                            template: "@shared/components/card",
                          },
                        },
                        list: {
                          type: "div",
                          children: "List",
                        },
                        table: {
                          type: "TableView",
                          props: {
                            items: "@store.state.items",
                          },
                        },
                      },
                    },
                  },
                  {
                    type: "PaginationControl",
                  },
                ],
              },
            ],
          },
          {
            type: "Views_",
            plugins: ["pagination2"],
            props: {
              view: "@store.state.viewMode",
              views: {
                cards: {
                  type: "Items",
                  props: {
                    template: {
                      type: "div",
                      children: "@item.name",
                    },
                  },
                },
                table: {
                  type: "TableView",
                },
              },
              items: "@store.state.items",
              // items: Array.from(new Array(10)).map((_v, index) => ({
              //   id: index + 1,
              //   name: `Item ${index + 1}`,
              //   value: Math.floor(Math.random() * 100),
              // })),
            },
            children: [
              {
                type: "PaginationControl",
              },
            ],
          },
          {
            type: "div",
            props: {
              className: "flex flex-col gap-4",
            },
            children: [
              { type: "div", children: "Example static items" },
              {
                type: "Items",
                plugins: ["pagination2"],
                props: {
                  items: Array.from(new Array(10)).map((_v, index) => ({
                    id: index + 1,
                    name: `Item ${index + 1}`,
                    value: Math.floor(Math.random() * 100),
                  })),
                  className: "flex flex-col gap-4",
                  template: "@shared/components/card",
                },
                children: [
                  {
                    type: "PaginationControl",
                  },
                ],
              },
            ],
          },
          {
            type: "div",
            props: {
              className: "flex flex-col gap-4",
            },
            children: [
              { type: "div", children: "Example store items" },
              {
                type: "Store",
                // plugins: ["pagination2"],
                collectionPath: "@store/state/items",
                subscribe: true,
                children: [
                  {
                    type: "Items",
                    plugins: ["pagination2"],
                    props: {
                      className:
                        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4",
                      template1: {
                        type: "div",
                        children: "@item.name",
                      },
                      template: "@shared/components/card",
                    },
                    children: [
                      {
                        type: "PaginationControl",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },

      {
        type: "StoreCollection_",
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
                  template: "@shared/components/card",
                },
              },
            ],
          },
        ],
      },
    ],
  },
};

export { config };
