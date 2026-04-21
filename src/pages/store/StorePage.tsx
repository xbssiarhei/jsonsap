import type { AppConfig } from "@/lib";
import mock from "./mock";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
};

type StoreState = {
  products: Product[];
  cart: Array<{ productId: number; quantity: number }>;
  selectedCategory: string;
  searchQuery: string;
  sortBy: string;
  categories: {
    id: string;
    label: string;
  }[];
};

const config: AppConfig<StoreState> = {
  store: {
    state: {
      products: mock.products,
      cart: [],
      selectedCategory: "all",
      searchQuery: "",
      sortBy: "name",
      categories: mock.categories,
    },
    actions: {
      addToCart: (state, _e, productId: number) => {
        const product = state.products.find((item) => item.id === productId);
        console.log(product);

        if (product.stock > 0) {
          product.stock--;
          const existing = state.cart.find(
            (item) => item.productId === productId,
          );
          if (existing) {
            existing.quantity += 1;
          } else {
            state.cart.push({ productId, quantity: 1 });
          }
        }
      },
      removeFromCart: (state, productId: number) => {
        const index = state.cart.findIndex(
          (item) => item.productId === productId,
        );
        if (index !== -1) {
          state.cart.splice(index, 1);
        }
      },
      setCategory: (state, _e, category: string) => {
        state.selectedCategory = category;
      },
      setSearchQuery: (state, _e, query: string) => {
        state.searchQuery = query;
      },
      setSortBy: (state, sortBy: string) => {
        state.sortBy = sortBy;
      },
    },
    computed: {
      filteredProducts: {
        $jsonata: `(
  $root := $;

  $filtered := $root.products[
    ($root.selectedCategory = "all" or category = $root.selectedCategory) and
    ($root.searchQuery = "" or $contains($lowercase(name), $lowercase($root.searchQuery)))
  ];

  $sorted := $filtered^(
    $root.sortBy = "price-asc" ? price :
    $root.sortBy = "price-desc" ? -price :
    $root.sortBy = "rating" ? -rating :
    name
  );
  $append([], $sorted)
)`,
        source: "@store.state",
      },
      cartTotal: (state) => {
        return state.cart.reduce((total, item) => {
          const product = state.products.find((p) => p.id === item.productId);
          return total + (product?.price || 0) * item.quantity;
        }, 0);
      },
      cartItemCount: (state) => {
        return state.cart.reduce((total, item) => total + item.quantity, 0);
      },
      cartItems: (state) => {
        return state.cart.map((item) => {
          const product = state.products.find((p) => p.id === item.productId);
          return {
            ...item,
            product,
          };
        });
      },
    },
  },
  ui: {
    type: "div",
    props: {
      className: "flex flex-col gap-6 p-8 max-w-7xl mx-auto",
    },
    children: [
      {
        type: "div",
        props: {
          className: "flex items-center justify-between",
        },
        children: [
          {
            type: "h1",
            props: {
              className: "text-4xl font-bold",
            },
            children: "Store",
          },
          {
            type: "Popover",
            children: [
              {
                type: "PopoverTrigger",
                children: [
                  {
                    type: "div",
                    props: {
                      className: "flex items-center gap-4 cursor-pointer",
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          className: "text-lg font-semibold",
                        },
                        children: "Cart: @store.computed.cartItemCount items",
                      },
                      {
                        type: "div",
                        props: {
                          className: "text-lg font-bold text-primary",
                        },
                        children: "$@store.computed.cartTotal",
                      },
                    ],
                  },
                ],
              },
              {
                type: "PopoverContent",
                props: {
                  className: "w-80",
                },
                children: [
                  {
                    type: "div",
                    props: {
                      className: "space-y-4",
                    },
                    children: [
                      {
                        type: "h3",
                        props: {
                          className: "font-semibold text-lg",
                        },
                        children: "Shopping Cart",
                      },
                      {
                        type: "div",
                        props: {
                          className: "space-y-2 max-h-96 overflow-auto",
                        },
                        children: [
                          {
                            type: "Repeater2",
                            store: "@store.computed.cartItems",
                            props: {
                              keyIdPath: "productId",
                            },
                            template: {
                              type: "div",
                              props: {
                                className:
                                  "flex items-center gap-3 py-2 border-b",
                              },
                              children: [
                                {
                                  type: "div",
                                  props: {
                                    className: "text-3xl",
                                  },
                                  children: "@item.product.image",
                                },
                                {
                                  type: "div",
                                  props: {
                                    className: "flex-1",
                                  },
                                  children: [
                                    {
                                      type: "div",
                                      props: {
                                        className: "font-medium text-sm",
                                      },
                                      children: "@item.product.name",
                                    },
                                    {
                                      type: "div",
                                      props: {
                                        className:
                                          "text-xs text-muted-foreground",
                                      },
                                      children: "Qty: @item.quantity",
                                    },
                                  ],
                                },
                                {
                                  type: "div",
                                  props: {
                                    className: "font-semibold",
                                  },
                                  children: "$@item.product.price",
                                },
                              ],
                            },
                          },
                        ],
                      },
                      {
                        type: "div",
                        props: {
                          className:
                            "flex justify-between items-center pt-2 border-t",
                        },
                        children: [
                          {
                            type: "span",
                            props: {
                              className: "font-semibold",
                            },
                            children: "Total:",
                          },
                          {
                            type: "span",
                            props: {
                              className: "font-bold text-lg text-primary",
                            },
                            children: "$@store.computed.cartTotal",
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
      {
        type: "div",
        props: {
          className: "flex gap-4 items-center flex-wrap",
        },
        children: [
          {
            type: "div",
            props: {
              className: "flex-1 min-w-[300px]",
            },
            children: [
              {
                type: "Input",
                props: {
                  placeholder: "Search products...",
                  value: "@store.state.searchQuery",
                  onChange: {
                    $action: "set",
                    path: "searchQuery",
                  },
                },
              },
            ],
          },
          {
            type: "div",
            props: {
              className: "flex gap-2",
            },
            children: [
              {
                type: "Repeater2",
                store: "@store.state.categories",
                template: {
                  type: "Button",
                  props: {
                    variant: "outline",
                    onClick: {
                      $action: "set",
                      path: "selectedCategory",
                      value: "@item.id",
                    },
                  },
                  children: "@item.label",
                  modifiers2: [
                    {
                      conditions: [
                        {
                          store: {
                            store: "@store/state",
                            path: "selectedCategory",
                          },
                          operator: "equals",
                          value: "@item.id",
                        },
                      ],
                      props: {
                        variant: "default",
                      },
                    },
                  ],
                },
              },
            ],
          },
          {
            type: "Select",
            props: {
              options: [
                { value: "name", label: "Sort by Name" },
                { value: "price-asc", label: "Price: Low to High" },
                { value: "price-desc", label: "Price: High to Low" },
                { value: "rating", label: "Highest Rated" },
              ],
              value: "@store.state.sortBy",
              onChange: {
                $action: "set",
                path: "sortBy",
              },
              // onChange: {
              //   $action: "call",
              //   name: "addToCart",
              //   args: ["@item.id"],
              // },
              placeholder: "Select option",
            },
          },
          {
            type: "select",
            props: {
              className: "border rounded px-3 py-2",
              value: "@store.state.sortBy",
              onChange: {
                $action: "set",
                path: "sortBy",
              },
            },
            children: [
              {
                type: "option",
                props: { value: "name" },
                children: "Sort by Name",
              },
              {
                type: "option",
                props: { value: "price-asc" },
                children: "Price: Low to High",
              },
              {
                type: "option",
                props: { value: "price-desc" },
                children: "Price: High to Low",
              },
              {
                type: "option",
                props: { value: "rating" },
                children: "Highest Rated",
              },
            ],
          },
        ],
      },
      {
        type: "div",
        props: {
          className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
        },
        children: [
          {
            type: "Repeater2",
            store: "@store.computed.filteredProducts",
            template: {
              type: "Card",
              props: {
                className: "flex flex-col",
              },
              children: [
                {
                  type: "CardHeader",
                  children: [
                    {
                      type: "div",
                      props: {
                        className: "text-6xl text-center mb-4",
                      },
                      children: "@item.image",
                    },
                    {
                      type: "CardAction",
                      children: [
                        {
                          type: "Badge",
                          children: " @item.stock",
                          modifiers2: [
                            {
                              conditions: [
                                {
                                  store: {
                                    store: "@store/state/products/@item.id",
                                    path: "stock",
                                  },
                                  operator: "equals",
                                  value: 1,
                                },
                              ],
                              props: {
                                variant: "destructive",
                              },
                            },
                            {
                              conditions: [
                                {
                                  store: {
                                    store: "@store/state/products/@item.id",
                                    path: "stock",
                                  },
                                  operator: "equals",
                                  value: 0,
                                },
                              ],
                              hide: true,
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: "CardTitle",
                      props: {
                        className: "text-lg",
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
                  props: {
                    className: "flex-1 flex flex-col gap-3",
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        className: "flex items-center gap-2",
                      },
                      children: [
                        {
                          type: "span",
                          props: {
                            className: "text-yellow-500",
                          },
                          children: "⭐",
                        },
                        {
                          type: "span",
                          props: {
                            className: "font-semibold",
                          },
                          children: "@item.rating",
                        },
                        {
                          type: "span",
                          props: {
                            className: "text-sm text-muted-foreground",
                          },
                          children: "(@item.reviews reviews)",
                        },
                      ],
                    },
                    {
                      type: "div",
                      props: {
                        className: "text-2xl font-bold text-primary",
                      },
                      children: "$@item.price",
                    },
                    {
                      type: "Button",
                      props: {
                        className: "w-full mt-auto",
                        onClick: {
                          $action: "call",
                          name: "addToCart",
                          args: ["@item.id"],
                        },
                      },
                      children: "Add to Cart",
                      modifiers2: [
                        {
                          conditions: [
                            {
                              store: {
                                store: "@store/state/products/@item.id",
                                path: "stock",
                              },
                              operator: "equals",
                              value: 0,
                            },
                          ],
                          props: {
                            disabled: true,
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
              modifiers2: [
                {
                  conditions: [
                    {
                      store: {
                        store: "@store/state/products/@item.id",
                        path: "stock",
                      },
                      operator: "equals",
                      value: 0,
                    },
                  ],
                  props: {
                    style: {
                      opacity: 0.2,
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  },
};

export default config;
