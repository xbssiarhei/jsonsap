import { type AppConfig } from "@/lib";
import { storeWithArray, storeWithMap, type Item } from "./store";
import modifiers from "@/modifiers";

type ValtioTestState = {
  map: {
    items: Map<number, Item>;
    isProxy?: boolean;
  };
  array: {
    items: Item[];
  };
  threshold: number;
};

const column = (state: string) => {
  return {
    type: "div",
    children: [
      {
        type: "div",
        props: {
          className:
            "grid gap-2 auto-cols-max max-h-[500px] overflow-auto mt-4 p-2",
          style: {
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            // gridTemplateColumns: "1fr 1fr",
          },
        },
        children: [
          {
            type: "Repeater2",
            plugins: ["repeater"],
            store: `@store.state.${state}.items`,
            template: {
              type: "Card",
              props: {
                className: "bg-green-50 px-3 py-2",
                style: {
                  transition: "background-color 0.3s ease",
                },
              },
              modifiers2: [
                modifiers.byLastUpdate(`@store/state/${state}`),
                modifiers.byStatus(`@store/state/${state}`),
                modifiers.byValue(`@store/state/${state}`),
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
        ],
      },
    ],
  };
};

const config: AppConfig<ValtioTestState> = {
  // state: {},
  store: {
    state: {
      map: storeWithMap,
      array: storeWithArray,
      threshold: 50,
    },
    computed: {
      activeCount: (state) =>
        Array.from(state.array.items.values()).filter(
          (item) => item.status === "active",
        ),
    },
  },
  ui: {
    type: "div",
    props: {
      className: "grid gap-2 max-h-[500px] overflow-auto",
      style: {
        gridTemplateColumns: "1fr 1fr",
      },
    },
    children: [column("map"), column("array")],
  },
};

export default config;
