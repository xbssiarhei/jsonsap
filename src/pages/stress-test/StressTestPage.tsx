import {
  componentRegistry,
  pluginRegistry,
  type AppConfig,
  type StoreConfig,
} from "../../lib";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { loggerPlugin } from "../../lib/plugins/logger";
import { wrapperPlugin } from "../../lib/plugins/wrapper";
import { StressTestItem } from "../../components/StressTestItem";
import { Repeater } from "../../lib/components/Repeater";

// Register components
componentRegistry.register("Button", Button);
componentRegistry.register("Card", Card);
componentRegistry.register("CardHeader", CardHeader);
componentRegistry.register("CardTitle", CardTitle);
componentRegistry.register("CardDescription", CardDescription);
componentRegistry.register("CardContent", CardContent);
componentRegistry.register("StressTestItem", StressTestItem);
componentRegistry.register("Repeater", Repeater);
componentRegistry.register("div", "div");
componentRegistry.register("h1", "h1");
componentRegistry.register("h2", "h2");
componentRegistry.register("p", "p");
componentRegistry.register("span", "span");

// Register plugins
pluginRegistry.register(loggerPlugin);
pluginRegistry.register(wrapperPlugin);

// Generate 30 items
const generateItems = () => {
  return Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    value: Math.floor(Math.random() * 100),
    status: Math.random() > 0.5 ? "active" : "inactive",
    lastUpdate: Date.now(),
  }));
};

const store: StoreConfig<{
  items: Array<{
    id: number;
    value: number;
    status: string;
    lastUpdate: number;
  }>;
  isRunning: boolean;
  updateCount: number;
  intervalId: number | null;
}> = {
  state: {
    items: generateItems(),
    isRunning: false,
    updateCount: 0,
    intervalId: null as number | null,
  },
  actions: {
    startStressTest: (state) => {
      if (state.isRunning) return;

      state.isRunning = true;

      // Update random item every second
      const id = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * state.items.length);
        state.items[randomIndex].value = Math.floor(Math.random() * 100);
        state.items[randomIndex].lastUpdate = Date.now();
        state.items[randomIndex].status =
          Math.random() > 0.5 ? "active" : "inactive";
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
      state.items = generateItems();
      state.updateCount = 0;
    },
  },
  computed: {
    activeCount: (state) =>
      state.items.filter((item) => item.status === "active").length,
    inactiveCount: (state) =>
      state.items.filter((item) => item.status === "inactive").length,
    averageValue: (state) => {
      const sum = state.items.reduce((acc, item) => acc + item.value, 0);
      return Math.round(sum / state.items.length);
    },
  },
};

// JSON configuration with store
export const stressTestPageConfig: AppConfig = {
  store: store as unknown as StoreConfig,
  ui: {
    type: "div",
    props: {
      style: {
        padding: "40px",
        maxWidth: "1200px",
        margin: "0 auto",
      },
    },
    children: [
      {
        type: "h1",
        props: {
          style: { fontSize: "36px", fontWeight: "bold", marginBottom: "16px" },
        },
        children: "Stress Test - 30 Items",
      },
      {
        type: "p",
        props: {
          style: { fontSize: "18px", color: "#666", marginBottom: "40px" },
        },
        children:
          "Testing reactive updates with 30 items updating every second",
      },
      {
        type: "Card",
        props: {
          style: { marginBottom: "24px" },
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
                    children: "Start Test",
                  },
                  {
                    type: "Button",
                    props: {
                      variant: "outline",
                      onClick: "@store.actions.stopStressTest",
                    },
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
            type: "Repeater",
            props: {
              items: "@store.state.items",
              itemConfig: {
                type: "StressTestItem",
                props: {
                  item: "@item",
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
                        backgroundColor: "#dcfce7",
                        borderColor: "#22c55e",
                      },
                    },
                  },
                  {
                    conditions: [
                      {
                        path: "item.value",
                        operator: "greaterThan",
                        value: 75,
                      },
                    ],
                    props: {
                      style: {
                        borderWidth: "2px",
                        borderColor: "#ef4444",
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    ],
  },
};
