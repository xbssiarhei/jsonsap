import {
  componentRegistry,
  pluginRegistry,
  type AppConfig,
  type StoreConfig,
} from "../../lib";
import { loggerPlugin } from "../../lib/plugins/logger";
import { wrapperPlugin } from "../../lib/plugins/wrapper";
import { StressTestItem } from "./components/StressTestItem";
import { NumericRoller } from "../../components/roller";
import modifiers from "@/modifiers";
import { proxy } from "valtio";

// Register page-specific components
componentRegistry.register("StressTestItem", StressTestItem);
componentRegistry.register("NumericRoller", NumericRoller);

// Register plugins
pluginRegistry.register(loggerPlugin);
pluginRegistry.register(wrapperPlugin);

/**
 * Generate n items as a Map with proxy-wrapped values
 * Each item is wrapped in proxy() for Valtio reactivity
 *
 * @param count - Number of items to generate
 * @returns Map of items with numeric keys
 */
const generateItems = (count: number) => {
  return new Map(
    Array.from({ length: count }, (_, i) => [
      i + 1,
      proxy({
        id: i + 1,
        value: Math.floor(Math.random() * 100),
        status: Math.random() > 0.5 ? "active" : "inactive",
        lastUpdate: Date.now(),
      }),
    ]),
  );
};

type Item = { id: number; value: number; status: string; lastUpdate: number };

/**
 * Stress test state structure
 * Uses Map for items to enable selective re-rendering with Valtio
 */
type StressState = {
  items: Map<number, Item>;
  isRunning: boolean;
  updateCount: number;
  intervalId: number | null;
  threshold: number;
  mapVersion: number; // Incremented when Map is cleared/refilled to trigger Repeater2 re-render
};

const COUNT_ITEMS = 42;

const store: StoreConfig<StressState> = {
  state: proxy({
    items: generateItems(COUNT_ITEMS),
    isRunning: false,
    updateCount: 0,
    intervalId: null as number | null,
    threshold: 75,
    mapVersion: 0, // Tracks Map replacements - increment to force Repeater2 re-render
    _isProxy: true,
  }),
  actions: {
    startStressTest: (state) => {
      if (state.isRunning) return;

      state.isRunning = true;
      const ids = Array.from(state.items.keys());

      // Update random item every 500ms
      const id = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * ids.length);
        const id = ids[randomIndex];
        const item = state.items.get(id);
        if (!item) {
          return;
        }
        // Mutate item properties directly - Valtio tracks changes
        item.value = Math.floor(Math.random() * 100);
        item.lastUpdate = Date.now();
        item.status = Math.random() > 0.5 ? "active" : "inactive";
        state.updateCount++;
      }, 500);

      state.intervalId = id as unknown as number;
    },
    stopStressTest: (state) => {
      if (!state.isRunning) return;

      if (state.intervalId !== null) {
        clearInterval(state.intervalId);
        state.intervalId = null;
      }

      state.isRunning = false;
    },
    resetItems: (state) => {
      // Clear existing Map and add new items
      // This approach maintains the same Map reference for Valtio tracking
      state.items.clear();
      const newItems = generateItems(10);
      newItems.forEach((item, id) => {
        state.items.set(id, item);
      });
      state.updateCount = 0;
      // Increment mapVersion to signal Repeater2 that Map contents changed
      state.mapVersion++;
    },
  },
  computed: {
    activeCount: (state) =>
      Array.from(state.items.values()).filter(
        (item) => item.status === "active",
      ).length,
    inactiveCount: (state) =>
      Array.from(state.items.values()).filter(
        (item) => item.status === "inactive",
      ).length,
    averageValue: (state) => {
      const items = Array.from(state.items.values());
      const sum = items.reduce((acc, item) => acc + item.value, 0);
      return Math.round(sum / items.length);
    },
  },
};

// JSON configuration with store
export const stressTestPageConfig: AppConfig<StressState> = {
  store: store,
  ui: {
    type: "PageRoot",
    children: [
      {
        type: "h1",
        props: {
          style: { fontSize: "36px", fontWeight: "bold", marginBottom: "16px" },
        },
        children: "Stress Test - @store.state.items.length Items",
      },
      {
        type: "p",
        props: {
          style: { fontSize: "18px", color: "#666", marginBottom: "40px" },
        },
        children:
          "Testing reactive updates with @store.state.items.length items updating every second",
      },
      {
        type: "Card",
        props: {
          className: "mb-4 sm:sticky top-2",
        },
        children: [
          {
            type: "CardHeader",
            children: [
              {
                type: "CardTitle",
                children: "Controls & Statistics",
              },
              {
                type: "CardDescription",
                children:
                  "Updates: @store.state.updateCount | Active: @store.computed.activeCount | Inactive: @store.computed.inactiveCount | Average: @store.computed.averageValue",
              },
            ],
          },
          {
            type: "CardContent",
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    gap: "8px",
                    marginBottom: "16px",
                  },
                },
                children: [
                  {
                    type: "Button",
                    props: {
                      variant: "default",
                      onClick: "@store.actions.startStressTest",
                    },
                    modifiers2: [
                      {
                        conditions: [
                          {
                            store: {
                              store: "@store/state",
                              path: "isRunning",
                            },
                            operator: "equals",
                            value: true,
                          },
                        ],
                        props: {
                          disabled: true,
                        },
                      },
                    ],
                    children: "Start Test",
                  },
                  {
                    type: "Button",
                    props: {
                      variant: "outline",
                      onClick: "@store.actions.stopStressTest",
                    },
                    modifiers2: [
                      {
                        conditions: [
                          {
                            store: {
                              store: "@store/state",
                              path: "isRunning",
                            },
                            operator: "equals",
                            value: false,
                          },
                        ],
                        props: {
                          disabled: true,
                        },
                      },
                    ],
                    children: "Stop Test",
                  },
                  {
                    type: "Button",
                    props: {
                      variant: "secondary",
                      onClick: "@store.actions.resetItems",
                    },
                    children: "Reset Items",
                  },
                ],
              },
              {
                type: "p",
                props: {
                  style: {
                    fontSize: "14px",
                    color: "#666",
                  },
                },
                children: "Status: @store.state.isRunning",
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginTop: "16px",
                  },
                },
                children: [
                  {
                    type: "label",
                    props: {
                      style: {
                        fontSize: "14px",
                        fontWeight: "500",
                      },
                    },
                    children: "Threshold for red highlight:",
                  },
                  {
                    type: "Input",
                    props: {
                      type: "number",
                      value: "@store.state.threshold",
                      autoBind: "threshold",
                      style: {
                        width: "80px",
                      },
                    },
                    plugins: ["autoBind"],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "div",
        props: {
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "12px",
          },
        },
        children: [
          {
            type: "Repeater2",
            store: "@store.state.items",
            template: {
              type: "Popover",
              children: [
                {
                  type: "PopoverTrigger",
                  children: [
                    {
                      type: "StressTestItem",
                      props: {
                        item: "@item",
                      },
                      modifiers2: [
                        modifiers.byStatus("@store/state"),
                        modifiers.byValue("@store/state"),
                        {
                          conditions: [
                            {
                              store: {
                                store: `@store/state/items/@item.id`,
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
                            style: {
                              borderWidth: "0px",
                              borderColor: "#ef4444",
                              backgroundColor: "#ef4444",
                            },
                          },
                        },
                      ],
                      children: [
                        {
                          type: "span",
                          props: {
                            className: "text-sm",
                          },
                          children: [
                            {
                              type: "NumericRoller",
                              props: {
                                value: "@item.value",
                                size: 20,
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "PopoverContent",
                  props: {
                    className: "w-80",
                    item: "@item",
                  },
                  modifiers2: [
                    {
                      conditions: [
                        {
                          store: {
                            store: `@store/state/items/@item.id`,
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
                        style: {
                          borderWidth: "0px",
                          borderColor: "#ef4444",
                          backgroundColor: "#ef4444",
                        },
                      },
                    },
                  ],
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        },
                      },
                      children: [
                        {
                          type: "h3",
                          props: {
                            style: {
                              fontSize: "16px",
                              fontWeight: "600",
                              marginBottom: "8px",
                            },
                          },
                          children: "Item #@item.id Details",
                        },
                        {
                          type: "div",
                          props: {
                            style: {
                              display: "flex",
                              justifyContent: "space-between",
                              padding: "4px 0",
                            },
                          },
                          children: [
                            {
                              type: "span",
                              props: {
                                style: {
                                  fontWeight: "500",
                                  color: "#666",
                                },
                              },
                              children: "ID:",
                            },
                            {
                              type: "span",
                              children: "@item.id",
                            },
                          ],
                        },
                        {
                          type: "div",
                          props: {
                            style: {
                              display: "flex",
                              justifyContent: "space-between",
                              padding: "4px 0",
                            },
                          },
                          children: [
                            {
                              type: "span",
                              props: {
                                style: {
                                  fontWeight: "500",
                                  color: "#666",
                                },
                              },
                              children: "Value:",
                            },
                            {
                              type: "span",
                              props: {
                                style: {
                                  fontWeight: "600",
                                  color: "#3b82f6",
                                },
                              },
                              children: "@item.value",
                            },
                          ],
                        },
                        {
                          type: "div",
                          props: {
                            style: {
                              display: "flex",
                              justifyContent: "space-between",
                              padding: "4px 0",
                            },
                          },
                          children: [
                            {
                              type: "span",
                              props: {
                                style: {
                                  fontWeight: "500",
                                  color: "#666",
                                },
                              },
                              children: "Status:",
                            },
                            {
                              type: "span",
                              props: {
                                style: {
                                  padding: "2px 8px",
                                  borderRadius: "4px",
                                  fontSize: "12px",
                                  fontWeight: "500",
                                },
                              },
                              modifiers2: [
                                {
                                  conditions: [
                                    {
                                      store: {
                                        store: `@store/state/items/@item.id`,
                                        path: "status",
                                      },
                                      operator: "equals",
                                      value: "active",
                                    },
                                  ],
                                  props: {
                                    style: {
                                      backgroundColor: "#dcfce7",
                                      color: "#16a34a",
                                    },
                                  },
                                },
                                {
                                  conditions: [
                                    {
                                      store: {
                                        store: `@store/state/items/@item.id`,
                                        path: "status",
                                      },
                                      operator: "equals",
                                      value: "inactive",
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
                      ],
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
};
