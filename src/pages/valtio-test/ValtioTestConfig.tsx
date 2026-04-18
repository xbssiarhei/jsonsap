import { pluginRegistry, type AppConfig } from "@/lib";
import { storeWithMap, type Item } from "./store";
// import { storePlugin } from "./storePlugin";
import { repeaterPlugin } from "./repeaterPlugin";
// import { modifiers2Plugin } from "./modifiers2Plugin";

pluginRegistry.register(repeaterPlugin);
// pluginRegistry.register(modifiers2Plugin);
// pluginRegistry.register(storePlugin);

type ValtioTestState = {
  items: Map<number, Item>;
  isProxy?: boolean;
};

const RowItem = {
  type: "Card",
  props: {
    style: {
      padding: "12px 16px",
      backgroundColor: "#f0fdf4",
      transition: "background-color 0.3s ease",
    },
  },
  modifiers: [
    {
      conditions: [
        {
          path: "item.lastUpdate",
          operator: "equals",
          value: 0,
        },
      ],
      props: {
        style: {
          backgroundColor: "white",
        },
      },
    },
  ],
  children: [
    {
      type: "div",
      props: {
        className: "flex items-center justify-between",
      },
      children: [
        {
          type: "div",
          props: {
            className: "flex items-center gap-3",
          },
          children: [
            {
              type: "span",
              props: {
                style: {
                  fontWeight: "bold",
                  fontSize: "14px",
                },
              },
              children: "#@item.id",
            },
            {
              type: "span",
              props: {
                style: {
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                },
              },
              modifiers: [
                {
                  conditions: [
                    {
                      path: "item.status",
                      operator: "equals",
                      value: "active",
                    },
                  ],
                  props: {
                    style: {
                      backgroundColor: "#dbeafe",
                      color: "#1e40af",
                    },
                  },
                },
                {
                  conditions: [
                    {
                      path: "item.status",
                      operator: "notEquals",
                      value: "active",
                    },
                  ],
                  props: {
                    style: {
                      backgroundColor: "#f3f4f6",
                      color: "#6b7280",
                    },
                  },
                },
              ],
              children: "@item.status",
            },
          ],
        },
        {
          type: "span",
          props: {
            style: {
              fontSize: "20px",
              fontWeight: "bold",
            },
          },
          children: "@item.value",
        },
      ],
    },
  ],
};

const config: AppConfig<ValtioTestState> = {
  // state: {},
  store: {
    state: storeWithMap,
    computed: {
      activeCount: (state) =>
        Array.from(state.items.values()).filter(
          (item) => item.status === "active",
        ),
    },
  },
  ui: {
    type: "div",
    props: {
      className:
        "grid gap-2 auto-cols-max max-h-[500px] overflow-auto mt-4 p-2",
      style: {
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      },
    },
    children: [
      {
        type: "Repeater2",
        plugins: ["repeater"],
        store: "@store.state.items",
        template: {
          type: "Card",
          props: {
            className: "bg-green-50 px-3 py-2",
            style: {
              // padding: "12px 16px",
              // backgroundColor: "#f0fdf4",
              transition: "background-color 0.3s ease",
            },
          },
          plugins: ["modifiers2"],
          modifiers2: [
            {
              conditions: [
                {
                  store: {
                    store: "@store/state/items/@item.id",
                    path: "lastUpdate",
                  },
                  operator: "equals",
                  value: 0,
                },
              ],
              props: {
                className: "bg-card",
              },
            },
            {
              conditions: [
                {
                  store: {
                    store: "@store/state/items/@item.id",
                    path: "status",
                  },
                  operator: "equals",
                  value: "active",
                },
              ],
              props: {
                className: "bg-green-100",
                style: {},
              },
            },
            {
              conditions: [
                {
                  store: {
                    store: "@store/state/items/@item.id",
                    path: "value",
                  },
                  operator: "greaterThan",
                  value: {
                    store: "@store/state",
                    path: "threshold",
                  },
                },
              ],
              props: {
                className: "text-secondary bg-destructive/70",
                style: {
                  borderWidth: "0px",
                  borderColor: "#ef4444",
                },
              },
            },
          ],
          children: [
            {
              type: "div",
              props: {
                className: "flex items-center justify-between",
              },
              children: [
                {
                  type: "div",
                  props: {
                    className: "flex items-center gap-3",
                  },
                  children: [
                    {
                      type: "span",
                      props: {
                        style: {
                          fontWeight: "bold",
                          fontSize: "14px",
                        },
                      },
                      children: "#@item.id",
                    },
                    {
                      type: "span",
                      props: {
                        style: {
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                        },
                      },
                      children: "@item.status",
                    },
                  ],
                },
                {
                  type: "span",
                  props: {
                    style: {
                      fontSize: "20px",
                      fontWeight: "bold",
                    },
                  },
                  children: " @item.value",
                },
              ],
            },
          ],
        },
      },
      // { type: "div", children: "B" },
    ],
  },
};

export default config;
