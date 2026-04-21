import type { AppConfig } from "@/lib";

type DashboardState = {
  metrics: {
    revenue: { value: string; change: string };
    subscriptions: { value: string; change: string };
    sales: { value: string; change: string };
    activeNow: { value: string; change: string };
  };
  chartData: Array<{ name: string; total: number }>;
  recentSales: Array<{
    id: number;
    name: string;
    email: string;
    amount: string;
    avatar: string;
  }>;
};

const config: AppConfig<DashboardState> = {
  store: {
    state: {
      metrics: {
        revenue: { value: "$45,231.89", change: "+20.1% from last month" },
        subscriptions: { value: "+2350", change: "+180.1% from last month" },
        sales: { value: "+12,234", change: "+19% from last month" },
        activeNow: { value: "+573", change: "+201 since last hour" },
      },
      chartData: [
        { name: "Jan", total: 2400 },
        { name: "Feb", total: 1398 },
        { name: "Mar", total: 9800 },
        { name: "Apr", total: 3908 },
        { name: "May", total: 4800 },
        { name: "Jun", total: 3800 },
        { name: "Jul", total: 4300 },
        { name: "Aug", total: 3200 },
        { name: "Sep", total: 5100 },
        { name: "Oct", total: 4600 },
        { name: "Nov", total: 3900 },
        { name: "Dec", total: 4200 },
      ],
      recentSales: [
        {
          id: 1,
          name: "Olivia Martin",
          email: "olivia.martin@email.com",
          amount: "+$1,999.00",
          avatar: "OM",
        },
        {
          id: 2,
          name: "Jackson Lee",
          email: "jackson.lee@email.com",
          amount: "+$39.00",
          avatar: "JL",
        },
        {
          id: 3,
          name: "Isabella Nguyen",
          email: "isabella.nguyen@email.com",
          amount: "+$299.00",
          avatar: "IN",
        },
        {
          id: 4,
          name: "William Kim",
          email: "will@email.com",
          amount: "+$99.00",
          avatar: "WK",
        },
        {
          id: 5,
          name: "Sofia Davis",
          email: "sofia.davis@email.com",
          amount: "+$39.00",
          avatar: "SD",
        },
      ],
    },
  },
  ui: {
    type: "PageRoot",
    props: {
      className: "flex flex-col gap-4",
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
              className: "text-3xl font-bold tracking-tight",
            },
            children: "Dashboard",
          },
        ],
      },
      {
        type: "div",
        props: {
          className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
        },
        children: [
          {
            type: "Card",
            children: [
              {
                type: "CardHeader",
                props: {
                  className:
                    "flex flex-row items-center justify-between space-y-0 pb-2",
                },
                children: [
                  {
                    type: "CardTitle",
                    props: {
                      className: "text-sm font-medium",
                    },
                    children: "Total Revenue",
                  },
                ],
              },
              {
                type: "CardContent",
                children: [
                  {
                    type: "div",
                    props: {
                      className: "text-2xl font-bold",
                    },
                    children: "@store.state.metrics.revenue.value",
                  },
                  {
                    type: "p",
                    props: {
                      className: "text-xs text-muted-foreground",
                    },
                    children: "@store.state.metrics.revenue.change",
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
                props: {
                  className:
                    "flex flex-row items-center justify-between space-y-0 pb-2",
                },
                children: [
                  {
                    type: "CardTitle",
                    props: {
                      className: "text-sm font-medium",
                    },
                    children: "Subscriptions",
                  },
                ],
              },
              {
                type: "CardContent",
                children: [
                  {
                    type: "div",
                    props: {
                      className: "text-2xl font-bold",
                    },
                    children: "@store.state.metrics.subscriptions.value",
                  },
                  {
                    type: "p",
                    props: {
                      className: "text-xs text-muted-foreground",
                    },
                    children: "@store.state.metrics.subscriptions.change",
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
                props: {
                  className:
                    "flex flex-row items-center justify-between space-y-0 pb-2",
                },
                children: [
                  {
                    type: "CardTitle",
                    props: {
                      className: "text-sm font-medium",
                    },
                    children: "Sales",
                  },
                ],
              },
              {
                type: "CardContent",
                children: [
                  {
                    type: "div",
                    props: {
                      className: "text-2xl font-bold",
                    },
                    children: "@store.state.metrics.sales.value",
                  },
                  {
                    type: "p",
                    props: {
                      className: "text-xs text-muted-foreground",
                    },
                    children: "@store.state.metrics.sales.change",
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
                props: {
                  className:
                    "flex flex-row items-center justify-between space-y-0 pb-2",
                },
                children: [
                  {
                    type: "CardTitle",
                    props: {
                      className: "text-sm font-medium",
                    },
                    children: "Active Now",
                  },
                ],
              },
              {
                type: "CardContent",
                children: [
                  {
                    type: "div",
                    props: {
                      className: "text-2xl font-bold",
                    },
                    children: "@store.state.metrics.activeNow.value",
                  },
                  {
                    type: "p",
                    props: {
                      className: "text-xs text-muted-foreground",
                    },
                    children: "@store.state.metrics.activeNow.change",
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
          className: "grid gap-4 md:grid-cols-2 lg:grid-cols-7",
        },
        children: [
          {
            type: "Card",
            props: {
              className: "col-span-4",
            },
            children: [
              {
                type: "CardHeader",
                children: [
                  {
                    type: "CardTitle",
                    children: "Overview",
                  },
                ],
              },
              {
                type: "CardContent",
                props: {
                  className: "pl-2",
                },
                children: [
                  {
                    type: "ChartContainer",
                    props: {
                      config: {},
                      style: { height: "350px" },
                    },
                    children: [
                      {
                        type: "LineChart",
                        props: {
                          data: "@store.state.chartData",
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
                              dataKey: "name",
                            },
                          },
                          {
                            type: "YAxis",
                          },
                          {
                            type: "Line",
                            props: {
                              type: "monotone",
                              dataKey: "total",
                              stroke: "#8884d8",
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
          {
            type: "Card",
            props: {
              className: "col-span-3",
            },
            children: [
              {
                type: "CardHeader",
                children: [
                  {
                    type: "CardTitle",
                    children: "Recent Sales",
                  },
                  {
                    type: "CardDescription",
                    children: "You made 265 sales this month.",
                  },
                ],
              },
              {
                type: "CardContent",
                children: [
                  {
                    type: "div",
                    props: {
                      className: "space-y-8",
                    },
                    children: [
                      {
                        type: "Repeater2",
                        store: "@store.state.recentSales",
                        template: {
                          type: "div",
                          props: {
                            className: "flex items-center",
                          },
                          children: [
                            {
                              type: "div",
                              props: {
                                className:
                                  "flex h-9 w-9 items-center justify-center rounded-full bg-muted",
                              },
                              children: [
                                {
                                  type: "span",
                                  props: {
                                    className: "text-sm font-medium",
                                  },
                                  children: "@item.avatar",
                                },
                              ],
                            },
                            {
                              type: "div",
                              props: {
                                className: "ml-4 space-y-1",
                              },
                              children: [
                                {
                                  type: "p",
                                  props: {
                                    className:
                                      "text-sm font-medium leading-none",
                                  },
                                  children: "@item.name",
                                },
                                {
                                  type: "p",
                                  props: {
                                    className: "text-sm text-muted-foreground",
                                  },
                                  children: "@item.email",
                                },
                              ],
                            },
                            {
                              type: "div",
                              props: {
                                className: "ml-auto font-medium",
                              },
                              children: "@item.amount",
                            },
                          ],
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

export default config;
