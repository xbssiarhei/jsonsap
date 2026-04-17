import { pluginRegistry, type AppConfig, type StoreConfig } from "../../lib";
import { loggerPlugin } from "../../lib/plugins/logger";
import { wrapperPlugin } from "../../lib/plugins/wrapper";
import mockData from "../jsonata/mock";

// Register plugins
pluginRegistry.register(loggerPlugin);
pluginRegistry.register(wrapperPlugin);

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  rating: number;
};

type ProductsState = {
  products: Product[];
  sortOrder: "asc" | "desc";
  priceThreshold: number;
};

const store: StoreConfig<ProductsState> = {
  state: {
    products: mockData,
    sortOrder: "asc",
    priceThreshold: 100,
  },
  actions: {
    toggleSortOrder: (state) => {
      state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
    },
    setPriceThreshold: (state, _e: unknown, value: number) => {
      state.priceThreshold = value;
    },
  },
  computed: {
    // JSONata computed - sort by price
    sortedByPrice: {
      $jsonata: "$ ^(>price)",
      source: "@store.state.products",
    },
    // JSONata computed - sort by price descending
    sortedByPriceDesc: {
      $jsonata: "$ ^(<price)",
      source: "@store.state.products",
    },
    // JSONata computed - filter expensive items
    expensiveProducts: {
      $jsonata: "$[price > 100]",
      source: "@store.state.products",
    },
    // JSONata computed - top 5 rated
    topRated: {
      $jsonata: "$ ^(>rating)[[0..4]]",
      source: "@store.state.products",
    },
    // JSONata computed - in stock items
    inStockProducts: {
      $jsonata: "$[inStock = true]",
      source: "@store.state.products",
    },
    // JSONata computed - group by category and count
    categoryCount: {
      $jsonata:
        "${ 'category': category, 'count': $count($) }^(>count) ~> $each(function($v) { { 'name': $v.category, 'count': $v.count } })",
      source: "@store.state.products",
    },
    // Function computed - total products count
    totalCount: (state) => state.products.length,
    // Function computed - average price
    averagePrice: (state) =>
      (
        state.products.reduce((sum, p) => sum + p.price, 0) /
        state.products.length
      ).toFixed(2),
  },
};

export const productsPageConfig: AppConfig<ProductsState> = {
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
      // Header
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
                marginBottom: "16px",
              },
            },
            children: "Dynamic Computed Properties",
          },
          {
            type: "p",
            props: {
              style: {
                fontSize: "18px",
                color: "#666",
                marginBottom: "16px",
              },
            },
            children:
              "Demonstrating JSONata-based computed properties defined in JSON config",
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                gap: "16px",
                fontSize: "14px",
                color: "#666",
              },
            },
            children: [
              {
                type: "span",
                children: "Total Products: @store.computed.totalCount",
              },
              {
                type: "span",
                children: "Average Price: $@store.computed.averagePrice",
              },
            ],
          },
        ],
      },
      // Grid layout
      {
        type: "div",
        props: {
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "24px",
          },
        },
        children: [
          // Top Rated Products
          {
            type: "Card",
            children: [
              {
                type: "CardHeader",
                children: [
                  {
                    type: "CardTitle",
                    children: "Top 5 Rated Products",
                  },
                  {
                    type: "CardDescription",
                    children: "JSONata: $ ^(>rating)[[0..4]]",
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
                        flexDirection: "column",
                        gap: "8px",
                      },
                    },
                    children: [
                      {
                        type: "Repeater",
                        props: {
                          items: "@store.computed.topRated",
                          template: {
                            type: "div",
                            props: {
                              style: {
                                padding: "8px",
                                borderRadius: "4px",
                                backgroundColor: "#f9fafb",
                                display: "flex",
                                justifyContent: "space-between",
                              },
                            },
                            children: [
                              {
                                type: "span",
                                props: {
                                  style: {
                                    fontWeight: "500",
                                  },
                                },
                                children: "@item.name",
                              },
                              {
                                type: "span",
                                props: {
                                  style: {
                                    color: "#f59e0b",
                                  },
                                },
                                children: "⭐ @item.rating",
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
          // Expensive Products
          {
            type: "Card",
            children: [
              {
                type: "CardHeader",
                children: [
                  {
                    type: "CardTitle",
                    children: "Expensive Products",
                  },
                  {
                    type: "CardDescription",
                    children: "JSONata: $[price > 100]",
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
                        flexDirection: "column",
                        gap: "8px",
                      },
                    },
                    children: [
                      {
                        type: "Repeater",
                        props: {
                          items: "@store.computed.expensiveProducts",
                          template: {
                            type: "div",
                            props: {
                              style: {
                                padding: "8px",
                                borderRadius: "4px",
                                backgroundColor: "#f9fafb",
                                display: "flex",
                                justifyContent: "space-between",
                              },
                            },
                            children: [
                              {
                                type: "span",
                                props: {
                                  style: {
                                    fontWeight: "500",
                                  },
                                },
                                children: "@item.name",
                              },
                              {
                                type: "span",
                                props: {
                                  style: {
                                    color: "#10b981",
                                  },
                                },
                                children: "$@item.price",
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
          // In Stock Products
          {
            type: "Card",
            children: [
              {
                type: "CardHeader",
                children: [
                  {
                    type: "CardTitle",
                    children: "In Stock Products",
                  },
                  {
                    type: "CardDescription",
                    children: "JSONata: $[inStock = true]",
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
                        flexDirection: "column",
                        gap: "8px",
                        maxHeight: "300px",
                        overflowY: "auto",
                      },
                    },
                    children: [
                      {
                        type: "Repeater",
                        props: {
                          items: "@store.computed.inStockProducts",
                          template: {
                            type: "div",
                            props: {
                              style: {
                                padding: "8px",
                                borderRadius: "4px",
                                backgroundColor: "#f9fafb",
                                display: "flex",
                                justifyContent: "space-between",
                              },
                            },
                            children: [
                              {
                                type: "span",
                                props: {
                                  style: {
                                    fontWeight: "500",
                                  },
                                },
                                children: "@item.name",
                              },
                              {
                                type: "span",
                                props: {
                                  style: {
                                    fontSize: "12px",
                                    color: "#666",
                                  },
                                },
                                children: "@item.category",
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
          // Sorted by Price
          {
            type: "Card",
            children: [
              {
                type: "CardHeader",
                children: [
                  {
                    type: "CardTitle",
                    children: "Sorted by Price (Ascending)",
                  },
                  {
                    type: "CardDescription",
                    children: "JSONata: $ ^(>price)",
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
                        flexDirection: "column",
                        gap: "8px",
                        maxHeight: "300px",
                        overflowY: "auto",
                      },
                    },
                    children: [
                      {
                        type: "Repeater",
                        props: {
                          items: "@store.computed.sortedByPrice",
                          template: {
                            type: "div",
                            props: {
                              style: {
                                padding: "8px",
                                borderRadius: "4px",
                                backgroundColor: "#f9fafb",
                                display: "flex",
                                justifyContent: "space-between",
                              },
                            },
                            children: [
                              {
                                type: "span",
                                props: {
                                  style: {
                                    fontWeight: "500",
                                  },
                                },
                                children: "@item.name",
                              },
                              {
                                type: "span",
                                props: {
                                  style: {
                                    color: "#3b82f6",
                                  },
                                },
                                children: "$@item.price",
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
    ],
  },
};
