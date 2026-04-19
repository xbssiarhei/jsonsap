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
  tmp?: boolean;
};

type ProductsState = {
  products: Product[];
  sortOrder: "asc" | "desc";
  priceThreshold: number;
  editingId: number | null;
  newProduct: {
    name: string;
    category: string;
    price: number;
    inStock: boolean;
    rating: number;
  };
};

const store: StoreConfig<ProductsState> = {
  state: {
    products: mockData,
    sortOrder: "asc",
    priceThreshold: 100,
    editingId: null,
    newProduct: {
      name: "",
      category: "",
      price: 0,
      inStock: true,
      rating: 0,
    },
  },
  actions: {
    toggleSortOrder: (state) => {
      state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
    },
    setPriceThreshold: (state, _e: unknown, value: number) => {
      state.priceThreshold = value;
    },
    deleteProduct: (state, _e: unknown, productId: number) => {
      const index = state.products.findIndex((p) => p.id === productId);
      if (index !== -1) {
        state.products.splice(index, 1);
      }
    },
    startEdit: (state, _e: unknown, productId: number) => {
      state.editingId = productId;
    },
    cancelEdit: (state) => {
      state.editingId = null;
    },
    updateProductField: (
      state,
      e: { target: { value: unknown } },
      _item: unknown,
      id: number,
      field: string,
    ) => {
      const product = state.products.find((p) => p.id === id);
      if (product) {
        (product as Record<string, unknown>)[field] = e.target.value;
      }
    },
    updateProductName: (
      state,
      e: { target: { value: unknown } },
      id: number,
    ) => {
      const product = state.products.find((p) => p.id === id);
      if (product) {
        product.name = String(e.target.value);
      }
    },
    updateProductCategory: (
      state,
      e: { target: { value: unknown } },
      id: number,
    ) => {
      const product = state.products.find((p) => p.id === id);
      if (product) {
        product.category = String(e.target.value);
      }
    },
    updateProductPrice: (
      state,
      e: { target: { value: unknown } },
      id: number,
    ) => {
      const product = state.products.find((p) => p.id === id);
      if (product) {
        product.price = Number(e.target.value);
      }
    },
    updateProductRating: (
      state,
      e: { target: { value: unknown } },
      id: number,
    ) => {
      const product = state.products.find((p) => p.id === id);
      if (product) {
        product.rating = Number(e.target.value);
      }
    },
    saveEdit: (state) => {
      state.editingId = null;
    },
    addProduct: (state) => {
      const newId = Math.max(...state.products.map((p) => p.id)) + 1;
      const index = state.products.push({
        id: newId,
        name: state.newProduct.name || "New Product",
        category: state.newProduct.category || "Electronics",
        price: Number(state.newProduct.price) || 0,
        inStock: state.newProduct.inStock,
        rating: Number(state.newProduct.rating) || 0,
        tmp: true,
      });

      console.log(state.products[index - 1]);

      setTimeout(() => {
        const product = state.products[index - 1];
        delete product.tmp;
      }, 3000);

      // Reset form
      state.newProduct = {
        name: "",
        category: "",
        price: 0,
        inStock: true,
        rating: 0,
      };
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
      $jsonata: "$[price > 200]",
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
  shared: {
    modifiers: {
      hideWhenEditing: {
        conditions: [
          {
            path: "item.id",
            operator: "equals",
            value: "@store.state.editingId",
          },
        ],
        props: {
          style: {
            display: "none",
          },
        },
      },
      hideWhenNotEditing: {
        conditions: [
          {
            path: "item.id",
            operator: "notEquals",
            value: "@store.state.editingId",
          },
        ],
        props: {
          style: {
            display: "none",
          },
        },
      },
      highlightEditing: {
        conditions: [
          {
            path: "item.id",
            operator: "equals",
            value: "@store.state.editingId",
          },
        ],
        props: {
          style: {
            backgroundColor: "#eff6ff",
          },
        },
      },
      fadeTemp: {
        conditions: [
          {
            path: "item.tmp",
            operator: "equals",
            value: true,
          },
        ],
        props: {
          style: {
            opacity: "0.2",
          },
          inert: true,
        },
      },
    },
  },
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
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
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
                    children:
                      "Expensive Products (@store.computed.expensiveProducts.length)",
                  },
                  {
                    type: "CardDescription",
                    children: "JSONata: $[price > 200]",
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
                    children:
                      "In Stock Products (@store.computed.inStockProducts.length)",
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
      // CRUD Table
      {
        type: "div",
        props: {
          style: {
            marginTop: "48px",
          },
        },
        children: [
          {
            type: "h2",
            props: {
              style: {
                fontSize: "28px",
                fontWeight: "bold",
                marginBottom: "24px",
              },
            },
            children: "Products Table (CRUD)",
          },
          // Add new product form
          {
            type: "Card",
            props: {
              style: {
                marginBottom: "24px",
                backgroundColor: "#f0fdf4",
              },
            },
            children: [
              {
                type: "CardHeader",
                children: [
                  {
                    type: "CardTitle",
                    children: "Add New Product",
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
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(150px, 1fr))",
                        gap: "12px",
                        marginBottom: "16px",
                      },
                    },
                    children: [
                      {
                        type: "Input",
                        props: {
                          placeholder: "Name",
                          value: "@store.state.newProduct.name",
                          onChange: {
                            $action: "set",
                            path: "newProduct.name",
                          },
                        },
                      },
                      {
                        type: "Input",
                        props: {
                          placeholder: "Category",
                          value: "@store.state.newProduct.category",
                          onChange: {
                            $action: "set",
                            path: "newProduct.category",
                          },
                        },
                      },
                      {
                        type: "Input",
                        props: {
                          type: "number",
                          placeholder: "Price",
                          value: "@store.state.newProduct.price",
                          onChange: {
                            $action: "set",
                            path: "newProduct.price",
                          },
                        },
                      },
                      {
                        type: "Input",
                        props: {
                          type: "number",
                          placeholder: "Rating",
                          value: "@store.state.newProduct.rating",
                          onChange: {
                            $action: "set",
                            path: "newProduct.rating",
                          },
                        },
                      },
                    ],
                  },
                  {
                    type: "Button",
                    props: {
                      onClick: "@store.actions.addProduct",
                    },
                    children: "Add Product",
                  },
                ],
              },
            ],
          },
          // Table
          {
            type: "div",
            props: {
              className: "max-h-[300px] overflow-auto",
              style: {
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              },
            },
            children: [
              // Table header
              {
                type: "div",
                props: {
                  className: "grid gap-4 sticky top-0 z-2",
                  style: {
                    gridTemplateColumns: "60px 2fr 1fr 100px 80px 80px 150px",
                    backgroundColor: "#f9fafb",
                    padding: "12px",
                    fontWeight: "600",
                    borderBottom: "1px solid #e5e7eb",
                  },
                },
                children: [
                  { type: "div", children: "ID" },
                  { type: "div", children: "Name" },
                  { type: "div", children: "Category" },
                  { type: "div", children: "Price" },
                  { type: "div", children: "Rating" },
                  { type: "div", children: "Stock" },
                  { type: "div", children: "Actions" },
                ],
              },
              // Table rows
              {
                type: "Repeater",
                props: {
                  items: "@store.state.products",
                  template: {
                    type: "div",
                    props: {
                      className: "grid gap-4 z-1",
                      style: {
                        gridTemplateColumns:
                          "60px 2fr 1fr 100px 80px 80px 150px",
                        padding: "12px",
                        borderBottom: "1px solid #e5e7eb",
                        alignItems: "center",
                      },
                      item: "@item",
                    },
                    modifiers: ["@shared/modifiers/highlightEditing", "@shared/modifiers/fadeTemp"],
                    children: [
                      {
                        type: "div",
                        children: "@item.id",
                      },
                      {
                        type: "div",
                        children: [
                          {
                            type: "ControlledInput",
                            props: {
                              value: "@item.name",
                              onChange: {
                                $action: "call",
                                name: "updateProductName",
                                args: ["@item.id"],
                              },
                            },
                            modifiers: "@shared/modifiers/hideWhenNotEditing",
                          },
                          {
                            type: "span",
                            children: "@item.name",
                            props: {
                              item: "@item",
                            },
                            modifiers: "@modifiers/hideWhenEditing",
                          },
                        ],
                      },
                      {
                        type: "div",
                        children: [
                          {
                            type: "ControlledInput",
                            props: {
                              value: "@item.category",
                              onChange: {
                                $action: "call",
                                name: "updateProductCategory",
                                args: ["@item.id"],
                              },
                            },
                            modifiers: [
                              {
                                conditions: [
                                  {
                                    path: "@store.state.editingId",
                                    operator: "notEquals",
                                    value: "@item.id",
                                  },
                                ],
                                props: {
                                  style: {
                                    display: "none",
                                  },
                                },
                              },
                            ],
                          },
                          {
                            type: "span",
                            children: "@item.category",
                            props: {
                              item: "@item",
                            },
                            modifiers: "@modifiers/hideWhenEditing",
                          },
                        ],
                      },
                      {
                        type: "div",
                        children: [
                          {
                            type: "ControlledInput",
                            props: {
                              type: "number",
                              value: "@item.price",
                              onChange: {
                                $action: "call",
                                name: "updateProductPrice",
                                args: ["@item.id"],
                              },
                            },
                            modifiers: [
                              {
                                conditions: [
                                  {
                                    path: "@store.state.editingId",
                                    operator: "notEquals",
                                    value: "@item.id",
                                  },
                                ],
                                props: {
                                  style: {
                                    display: "none",
                                  },
                                },
                              },
                            ],
                          },
                          {
                            type: "span",
                            children: "$@item.price",
                            props: {
                              item: "@item",
                            },
                            modifiers: "@modifiers/hideWhenEditing",
                          },
                        ],
                      },
                      {
                        type: "div",
                        children: [
                          {
                            type: "ControlledInput",
                            props: {
                              type: "number",
                              value: "@item.rating",
                              onChange: {
                                $action: "call",
                                name: "updateProductRating",
                                args: ["@item.id"],
                              },
                            },
                            modifiers: [
                              {
                                conditions: [
                                  {
                                    path: "@store.state.editingId",
                                    operator: "notEquals",
                                    value: "@item.id",
                                  },
                                ],
                                props: {
                                  style: {
                                    display: "none",
                                  },
                                },
                              },
                            ],
                          },
                          {
                            type: "span",
                            children: "@item.rating",
                            props: {
                              item: "@item",
                            },
                            modifiers: [
                              {
                                conditions: [
                                  {
                                    path: "@store.state.editingId",
                                    operator: "equals",
                                    value: "@item.id",
                                  },
                                ],
                                props: {
                                  style: {
                                    display: "none",
                                  },
                                },
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: "div",
                        children: [
                          {
                            type: "Checkbox",
                            props: {
                              item: "@item",
                              checked: "@item.inStock",
                            },
                          },
                        ],
                      },
                      {
                        type: "div",
                        props: {
                          style: {
                            display: "flex",
                            gap: "8px",
                          },
                        },
                        children: [
                          {
                            type: "Button",
                            props: {
                              variant: "outline",
                              size: "sm",
                              onClick: {
                                $action: "call",
                                name: "startEdit",
                                args: ["@item.id"],
                              },
                            },
                            children: "Edit",
                            modifiers: [
                              {
                                conditions: [
                                  {
                                    path: "@store.state.editingId",
                                    operator: "equals",
                                    value: "@item.id",
                                  },
                                ],
                                props: {
                                  style: {
                                    display: "none",
                                  },
                                },
                              },
                            ],
                          },
                          {
                            type: "Button",
                            props: {
                              variant: "default",
                              size: "sm",
                              onClick: {
                                $action: "set",
                                path: "editingId",
                                value: null,
                              },
                              item: "@item",
                            },
                            children: "Save",
                            modifiers: [
                              {
                                conditions: [
                                  {
                                    path: "item.id",
                                    operator: "notEquals",
                                    value: "@store.state.editingId",
                                  },
                                ],
                                props: {
                                  style: {
                                    display: "none",
                                  },
                                },
                              },
                            ],
                          },
                          {
                            type: "Button",
                            props: {
                              variant: "destructive",
                              size: "sm",
                              onClick: {
                                $action: "call",
                                name: "deleteProduct",
                                args: ["@item.id"],
                              },
                            },
                            children: "Delete",
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
};
