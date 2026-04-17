import { pluginRegistry, type AppConfig, type StoreConfig } from "../../lib";
import { loggerPlugin } from "../../lib/plugins/logger";
import { wrapperPlugin } from "../../lib/plugins/wrapper";
import { ChartTooltipContent } from "../../components/ui/chart";

// Register plugins
pluginRegistry.register(loggerPlugin);
pluginRegistry.register(wrapperPlugin);

type DashboardState = {
  salesData: Array<{ month: string; sales: number; revenue: number }>;
  categoryData: Array<{ name: string; value: number; color: string }>;
  stats: {
    totalSales: number;
    totalRevenue: number;
    avgOrderValue: number;
    growth: number;
  };
};

const store: StoreConfig<DashboardState> = {
  state: {
    salesData: [
      { month: "Jan", sales: 186, revenue: 4200 },
      { month: "Feb", sales: 305, revenue: 6800 },
      { month: "Mar", sales: 237, revenue: 5300 },
      { month: "Apr", sales: 273, revenue: 6100 },
      { month: "May", sales: 209, revenue: 4700 },
      { month: "Jun", sales: 314, revenue: 7000 },
    ],
    categoryData: [
      { name: "Electronics", value: 35, color: "#3b82f6" },
      { name: "Clothing", value: 25, color: "#10b981" },
      { name: "Food", value: 20, color: "#f59e0b" },
      { name: "Books", value: 15, color: "#8b5cf6" },
      { name: "Other", value: 5, color: "#6b7280" },
    ],
    stats: {
      totalSales: 1524,
      totalRevenue: 34100,
      avgOrderValue: 22.38,
      growth: 12.5,
    },
  },
  actions: {
    refreshData: (state) => {
      // Simulate data refresh
      state.salesData = state.salesData.map((item) => ({
        ...item,
        sales: Math.floor(Math.random() * 200 + 150),
        revenue: Math.floor(Math.random() * 3000 + 4000),
      }));

      const totalSales = state.salesData.reduce(
        (sum, item) => sum + item.sales,
        0,
      );
      const totalRevenue = state.salesData.reduce(
        (sum, item) => sum + item.revenue,
        0,
      );

      state.stats.totalSales = totalSales;
      state.stats.totalRevenue = totalRevenue;
      state.stats.avgOrderValue = totalRevenue / totalSales;
      state.stats.growth = Math.random() * 20 - 5;
    },
  },
  computed: {
    totalSalesFormatted: (state) => state.stats.totalSales.toLocaleString(),
    totalRevenueFormatted: (state) =>
      `$${state.stats.totalRevenue.toLocaleString()}`,
    avgOrderValueFormatted: (state) =>
      `$${state.stats.avgOrderValue.toFixed(2)}`,
    growthFormatted: (state) =>
      `${state.stats.growth > 0 ? "+" : ""}${state.stats.growth.toFixed(1)}%`,
  },
};

const chartConfig = {
  sales: {
    label: "Sales",
    color: "#3b82f6",
  },
  revenue: {
    label: "Revenue",
    color: "#10b981",
  },
};

export const dashboardPageConfig: AppConfig<DashboardState> = {
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
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              },
            },
            children: [
              {
                type: "h1",
                props: {
                  style: {
                    fontSize: "36px",
                    fontWeight: "bold",
                  },
                },
                children: "Dashboard",
              },
              {
                type: "Button",
                props: {
                  onClick: "@store.actions.refreshData",
                },
                children: "Refresh Data",
              },
            ],
          },
          {
            type: "p",
            props: {
              style: {
                fontSize: "18px",
                color: "#666",
              },
            },
            children: "Sales and revenue analytics dashboard",
          },
        ],
      },
      // Stats Cards
      {
        type: "div",
        props: {
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          },
        },
        children: [
          {
            type: "Card",
            children: [
              {
                type: "CardHeader",
                children: [
                  {
                    type: "CardTitle",
                    props: {
                      style: { fontSize: "14px", fontWeight: "500" },
                    },
                    children: "Total Sales",
                  },
                ],
              },
              {
                type: "CardContent",
                children: [
                  {
                    type: "p",
                    props: {
                      style: {
                        fontSize: "32px",
                        fontWeight: "bold",
                      },
                    },
                    children: "@store.computed.totalSalesFormatted",
                  },
                ],
              },
            ],
          },
          {
            type: "Card",
            children: [
              {
                type: "CardHeader",
                children: [
                  {
                    type: "CardTitle",
                    props: {
                      style: { fontSize: "14px", fontWeight: "500" },
                    },
                    children: "Total Revenue",
                  },
                ],
              },
              {
                type: "CardContent",
                children: [
                  {
                    type: "p",
                    props: {
                      style: {
                        fontSize: "32px",
                        fontWeight: "bold",
                      },
                    },
                    children: "@store.computed.totalRevenueFormatted",
                  },
                ],
              },
            ],
          },
          {
            type: "Card",
            children: [
              {
                type: "CardHeader",
                children: [
                  {
                    type: "CardTitle",
                    props: {
                      style: { fontSize: "14px", fontWeight: "500" },
                    },
                    children: "Avg Order Value",
                  },
                ],
              },
              {
                type: "CardContent",
                children: [
                  {
                    type: "p",
                    props: {
                      style: {
                        fontSize: "32px",
                        fontWeight: "bold",
                      },
                    },
                    children: "@store.computed.avgOrderValueFormatted",
                  },
                ],
              },
            ],
          },
          {
            type: "Card",
            children: [
              {
                type: "CardHeader",
                children: [
                  {
                    type: "CardTitle",
                    props: {
                      style: { fontSize: "14px", fontWeight: "500" },
                    },
                    children: "Growth",
                  },
                ],
              },
              {
                type: "CardContent",
                children: [
                  {
                    type: "p",
                    props: {
                      style: {
                        fontSize: "32px",
                        fontWeight: "bold",
                      },
                    },
                    children: "@store.computed.growthFormatted",
                  },
                ],
              },
            ],
          },
        ],
      },
      // Charts
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
          {
            type: "Card",
            children: [
              {
                type: "CardHeader",
                children: [
                  {
                    type: "CardTitle",
                    children: "Sales Overview",
                  },
                  {
                    type: "CardDescription",
                    children: "Monthly sales data",
                  },
                ],
              },
              {
                type: "CardContent",
                children: [
                  {
                    type: "ChartContainer",
                    props: {
                      config: chartConfig,
                      style: { height: "300px" },
                      className: "w-full",
                    },
                    children: [
                      {
                        type: "BarChart",
                        props: {
                          data: "@store.state.salesData",
                          // data: store.state.salesData.slice(),
                        },
                        children: [
                          {
                            type: "CartesianGrid",
                            props: {
                              strokeDasharray: "3 3",
                            },
                          },
                          {
                            type: "XAxis",
                            props: {
                              dataKey: "month",
                            },
                          },
                          {
                            type: "YAxis",
                          },
                          {
                            type: "ChartTooltip",
                            props: {
                              content: ChartTooltipContent,
                            },
                          },
                          {
                            type: "Bar",
                            props: {
                              dataKey: "sales",
                              fill: "#3b82f6",
                            },
                          },
                          {
                            type: "Bar",
                            props: {
                              dataKey: "revenue",
                              fill: "#3b82f6",
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
            type: "Card",
            children: [
              {
                type: "CardHeader",
                children: [
                  {
                    type: "CardTitle",
                    children: "Revenue Trend",
                  },
                  {
                    type: "CardDescription",
                    children: "Monthly revenue data",
                  },
                ],
              },
              {
                type: "CardContent",
                children: [
                  {
                    type: "ChartContainer",
                    props: {
                      config: chartConfig,
                      style: { height: "300px" },
                    },
                    children: [
                      {
                        type: "LineChart",
                        props: {
                          data: "@store.state.salesData",
                        },
                        children: [
                          {
                            type: "CartesianGrid",
                            props: {
                              strokeDasharray: "3 3",
                            },
                          },
                          {
                            type: "XAxis",
                            props: {
                              dataKey: "month",
                            },
                          },
                          {
                            type: "YAxis",
                          },
                          {
                            type: "ChartTooltip",
                            props: {
                              content: ChartTooltipContent,
                            },
                          },
                          {
                            type: "Line",
                            props: {
                              type: "monotone",
                              dataKey: "revenue",
                              stroke: "#10b981",
                              strokeWidth: 2,
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
    ],
  },
};
