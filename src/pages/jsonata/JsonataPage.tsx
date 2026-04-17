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
import { loggerPlugin } from "../../lib/plugins/logger";
import { wrapperPlugin } from "../../lib/plugins/wrapper";
import { autoBindPlugin } from "../../lib/plugins/autoBind";
import { Repeater } from "../../lib/components/Repeater";
import jsonata from "jsonata";
import mockData from "./mock";

// Register components
componentRegistry.register("Button", Button);
componentRegistry.register("Card", Card);
componentRegistry.register("CardHeader", CardHeader);
componentRegistry.register("CardTitle", CardTitle);
componentRegistry.register("CardDescription", CardDescription);
componentRegistry.register("CardContent", CardContent);
componentRegistry.register("Input", Input);
componentRegistry.register("Repeater", Repeater);
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
};

const sampleProducts: Product[] = mockData;

const store: StoreConfig<JsonataState> = {
  state: {
    products: sampleProducts,
    filteredProducts: sampleProducts,
    query: "$[price < 100]",
    error: "",
  },
  actions: {
    applyFilter: async (state) => {
      try {
        const expression = jsonata(state.query);
        const result = await expression.evaluate(state.products);
        state.filteredProducts = Array.isArray(result)
          ? result
          : result
            ? [result]
            : [];
        state.error = "";
      } catch (err) {
        state.error =
          err instanceof Error ? err.message : "Invalid JSONata query";
        state.filteredProducts = [];
      }
    },
    resetFilter: (state) => {
      state.query = "$[price < 100]";
      state.filteredProducts = state.products.filter((p) => p.price < 100);
      state.error = "";
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
      } catch (err) {
        state.error =
          err instanceof Error ? err.message : "Invalid JSONata query";
        state.filteredProducts = [];
      }
    },
  },
  computed: {
    resultCount: (state) => state.filteredProducts.length,
    hasError: (state) => state.error.length > 0,
  },
};

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
  { label: "Top 3 by rating", query: "$ ^(>rating)[0..2]" },
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
                      autoBind: "query",
                      placeholder: "Enter JSONata query...",
                      style: {
                        flex: 1,
                      },
                    },
                    plugins: ["autoBind"],
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
                          variant: "outline",
                          size: "sm",
                          onClick: "@store.actions.setPresetQuery",
                          item: "@item.query",
                        },
                        children: "@item.query",
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
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "16px",
          },
        },
        children: [
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
                        children: "@item.inStock ? 'In Stock' : 'Out of Stock'",
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
};
