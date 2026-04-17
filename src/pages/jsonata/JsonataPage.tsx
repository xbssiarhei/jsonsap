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
import { Input } from "../../components/ui/input";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart";
import { loggerPlugin } from "../../lib/plugins/logger";
import { wrapperPlugin } from "../../lib/plugins/wrapper";
import { autoBindPlugin } from "../../lib/plugins/autoBind";
import { Repeater } from "../../lib/components/Repeater";
import jsonata from "jsonata";
import mockData from "./mock";
import { PieChart, Pie, Cell } from "recharts";

// Register components
componentRegistry.register("Button", Button);
componentRegistry.register("Card", Card);
componentRegistry.register("CardHeader", CardHeader);
componentRegistry.register("CardTitle", CardTitle);
componentRegistry.register("CardDescription", CardDescription);
componentRegistry.register("CardContent", CardContent);
componentRegistry.register("Input", Input);
componentRegistry.register("Repeater", Repeater);
componentRegistry.register("ChartContainer", ChartContainer);
componentRegistry.register("ChartTooltip", ChartTooltip);
componentRegistry.register("ChartTooltipContent", ChartTooltipContent);
componentRegistry.register("PieChart", PieChart);
componentRegistry.register("Pie", Pie);
componentRegistry.register("Cell", Cell);
componentRegistry.register("div", "div");
componentRegistry.register("h1", "h1");
componentRegistry.register("h2", "h2");
componentRegistry.register("p", "p");
componentRegistry.register("span", "span");

// Register plugins
pluginRegistry.register(loggerPlugin);
pluginRegistry.register(wrapperPlugin);
pluginRegistry.register(autoBindPlugin);

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  rating: number;
};

type JsonataState = {
  products: Product[];
  filteredProducts: Product[];
  query: string;
  error: string;
  categoryData: Array<{ name: string; value: number; fill: string }>;
};

const sampleProducts: Product[] = mockData;

const CATEGORY_COLORS: Record<string, string> = {
  Electronics: "#3b82f6",
  Furniture: "#10b981",
  Stationery: "#f59e0b",
  Appliances: "#8b5cf6",
  Sports: "#ef4444",
  Accessories: "#ec4899",
};

const store: StoreConfig<JsonataState> = {
  state: {
    products: sampleProducts,
    filteredProducts: sampleProducts,
    query: "$[price < 100]",
    error: "",
    categoryData: [],
  },
  actions: {
    applyFilter: async (state) => {
      if (!state.query) {
        state.filteredProducts = state.products;
        updateCategoryData(state);
        return;
      }
      try {
        const expression = jsonata(state.query);
        const result = await expression.evaluate(state.products);
        state.filteredProducts = Array.isArray(result)
          ? result
          : result
            ? [result]
            : [];
        state.error = "";
        updateCategoryData(state);
      } catch (err) {
        state.error =
          err instanceof Error ? err.message : "Invalid JSONata query";
        state.filteredProducts = [];
        state.categoryData = [];
      }
    },
    resetFilter: (state) => {
      state.query = "";
      state.filteredProducts = state.products;
      state.error = "";
      updateCategoryData(state);
    },
    setPresetQuery: async (
      state,
      _e: unknown,
      _item: unknown,
      query: string,
    ) => {
      try {
        if (query === undefined) {
          throw Error("Query is undefined");
        }
        state.query = query;
        const expression = jsonata(query);
        const result = await expression.evaluate(state.products);
        state.filteredProducts = Array.isArray(result)
          ? result
          : result
            ? [result]
            : [];
        state.error = "";
        updateCategoryData(state);
      } catch (err) {
        state.error =
          err instanceof Error ? err.message : "Invalid JSONata query";
        state.filteredProducts = [];
        state.categoryData = [];
      }
    },
  },
  computed: {
    resultCount: (state) => state.filteredProducts.length,
    hasError: (state) => state.error.length > 0,
  },
};

updateCategoryData(store.state);

function updateCategoryData(state: JsonataState) {
  const categoryCount: Record<string, number> = {};

  state.filteredProducts.forEach((product) => {
    const category = product.category;
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });

  state.categoryData = Object.entries(categoryCount).map(([name, value]) => ({
    name,
    value,
    fill: CATEGORY_COLORS[name] || "#6b7280",
  }));
}

const presetQueries = [
  { label: "Price < $100", query: "$[price < 100]" },
  { label: "Electronics only", query: "$[category = 'Electronics']" },
  { label: "In stock", query: "$[inStock = true]" },
  { label: "Rating > 4.5", query: "$[rating > 4.5]" },
  {
    label: "Furniture under $300",
    query: "$[category = 'Furniture' and price < 300]",
  },
  { label: "Sort by price (asc)", query: "$ ^(price)" },
  { label: "Sort by price (desc)", query: "$ ^(>price)" },
  { label: "Top 3 by rating", query: "$ ^(>rating)[[0..2]]" },
];

export const jsonataPageConfig: AppConfig<JsonataState> = {
  store: store,
  ui: {
    type: "div",
    props: {
      style: {
        padding: "40px",
        maxWidth: "1400px",
        margin: "0 auto",
      },
    },
    children: [
      {
        type: "div",
        props: {
          style: {
            marginBottom: "32px",
          },
        },
        children: [
          {
            type: "h1",
            props: {
              style: {
                fontSize: "36px",
                fontWeight: "bold",
                marginBottom: "8px",
              },
            },
            children: "JSONata Filtering",
          },
          {
            type: "p",
            props: {
              style: {
                fontSize: "18px",
                color: "#666",
                marginBottom: "24px",
              },
            },
            children: "Filter and transform data using JSONata queries",
          },
        ],
      },
      // Query Input Section
      {
        type: "Card",
        props: {
          style: {
            marginBottom: "24px",
          },
        },
        children: [
          {
            type: "CardHeader",
            children: [
              {
                type: "CardTitle",
                children: "JSONata Query",
              },
              {
                type: "CardDescription",
                children: "Enter a JSONata expression to filter products",
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
                    type: "Input",
                    props: {
                      value: "@store.state.query",
                      onChange: {
                        $action: "set",
                        path: "query",
                      },
                      placeholder: "Enter JSONata query...",
                      style: {
                        flex: 1,
                      },
                    },
                  },
                  {
                    type: "Button",
                    props: {
                      onClick: "@store.actions.applyFilter",
                    },
                    children: "Apply Filter",
                  },
                  {
                    type: "Button",
                    props: {
                      onClick: "@store.actions.resetFilter",
                      variant: "outline",
                    },
                    children: "Reset",
                  },
                ],
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "@store.computed.hasError ? 'block' : 'none'",
                    padding: "12px",
                    backgroundColor: "#fee",
                    borderRadius: "6px",
                    color: "#c00",
                    marginBottom: "16px",
                  },
                },
                children: "@store.state.error",
              },
              {
                type: "div",
                props: {
                  style: {
                    marginBottom: "8px",
                    fontWeight: "500",
                  },
                },
                children: "Preset Queries:",
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                  },
                },
                children: [
                  {
                    type: "Repeater",
                    props: {
                      items: presetQueries,
                      template: {
                        type: "Button",
                        props: {
                          item: "@item",
                          variant: "outline",
                          size: "sm",
                          onClick: {
                            $action: "set",
                            path: "query",
                            value: "@item.query",
                            then: "applyFilter",
                          },
                        },
                        modifiers: [
                          {
                            conditions: [
                              {
                                path: "item.query",
                                operator: "equals",
                                value: "@store.state.query",
                              },
                            ],
                            props: {
                              variant: "default",
                            },
                          },
                        ],
                        children: "@item.label",
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      // Results Section
      {
        type: "div",
        props: {
          style: {
            display: "grid",
            // gridTemplateColumns: "1fr 400px",
            gridTemplateColumns: "1fr",
            // gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "24px",
            marginBottom: "24px",
          },
        },
        children: [
          {
            type: "div",
            children: [
              {
                type: "div",
                props: {
                  style: {
                    marginBottom: "16px",
                    fontSize: "18px",
                    fontWeight: "500",
                  },
                },
                children: "Results: @store.computed.resultCount products",
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "16px",
                  },
                },
                children: [
                  {
                    type: "Card",
                    props: {
                      style: {
                        gridRow: "span 2",
                      },
                    },
                    children: [
                      {
                        type: "CardHeader",
                        children: [
                          {
                            type: "CardTitle",
                            children: "Category Distribution",
                          },
                          {
                            type: "CardDescription",
                            children: "Products by category",
                          },
                        ],
                      },
                      {
                        type: "CardContent",
                        children: [
                          {
                            type: "ChartContainer",
                            props: {
                              config: {},
                              className: "w-full",
                              style: { height: "300px" },
                            },
                            children: [
                              {
                                type: "PieChart",
                                children: [
                                  {
                                    type: "Pie",
                                    props: {
                                      data: "@store.state.categoryData",
                                      dataKey: "value",
                                      nameKey: "name",
                                      cx: "50%",
                                      cy: "50%",
                                      outerRadius: 100,
                                      label: true,
                                    },
                                  },
                                  {
                                    type: "ChartTooltip",
                                    props: {
                                      content: ChartTooltipContent,
                                    },
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
                    type: "Repeater",
                    props: {
                      items: "@store.state.filteredProducts",
                      template: {
                        type: "Card",
                        children: [
                          {
                            type: "CardHeader",
                            children: [
                              {
                                type: "CardTitle",
                                props: {
                                  style: {
                                    fontSize: "18px",
                                  },
                                },
                                children: "@item.name",
                              },
                              {
                                type: "CardDescription",
                                children: "@item.category",
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
                                    justifyContent: "space-between",
                                    marginBottom: "8px",
                                  },
                                },
                                children: [
                                  {
                                    type: "span",
                                    props: {
                                      style: {
                                        fontSize: "24px",
                                        fontWeight: "bold",
                                        color: "#3b82f6",
                                      },
                                    },
                                    children: "$@item.price",
                                  },
                                  {
                                    type: "span",
                                    props: {
                                      style: {
                                        fontSize: "14px",
                                        color: "#666",
                                      },
                                    },
                                    children: "⭐ @item.rating",
                                  },
                                ],
                              },
                              {
                                type: "div",
                                props: {
                                  style: {
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    display: "inline-block",
                                  },
                                },
                                modifiers: [
                                  {
                                    conditions: [
                                      {
                                        path: "item.inStock",
                                        operator: "equals",
                                        value: true,
                                      },
                                    ],
                                    props: {
                                      style: {
                                        backgroundColor: "#d1fae5",
                                        color: "#065f46",
                                      },
                                    },
                                  },
                                  {
                                    conditions: [
                                      {
                                        path: "item.inStock",
                                        operator: "equals",
                                        value: false,
                                      },
                                    ],
                                    props: {
                                      style: {
                                        backgroundColor: "#fee2e2",
                                        color: "#991b1b",
                                      },
                                    },
                                  },
                                ],
                                children:
                                  "@item.inStock ? 'In Stock' : 'Out of Stock'",
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
    ],
  },
};
