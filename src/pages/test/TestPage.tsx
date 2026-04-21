import type { AppConfig } from "@/lib";

type TestState = {
  items: Array<{ id: number; name: string; value: number }>;
};

const config: AppConfig<TestState> = {
  store: {
    state: {
      items: Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        value: Math.floor(Math.random() * 100),
      })),
    },
  },
  ui: {
    type: "div",
    props: {
      className: "p-8 max-w-4xl mx-auto",
    },
    children: [
      {
        type: "h1",
        props: {
          className: "text-3xl font-bold mb-6",
        },
        children: "Pagination Test",
      },
      {
        type: "StoreCollection",
        // store: "@store.state.items",
        plugins: ["pagination"],
        props: {
          pageSize: 10,
          store: "@store.state.items",
        },
        children: [
          {
            type: "div",
            props: {
              className: "grid grid-cols-1 md:grid-cols-2 gap-4",
            },
            children: [
              {
                type: "CollectionRepeater",
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
                          children: "@item.value",
                        },
                      ],
                    },
                  ],
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
