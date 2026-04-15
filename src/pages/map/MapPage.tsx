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
import { Repeater } from "../../components/Repeater";

// Register components
componentRegistry.register("Button", Button);
componentRegistry.register("Card", Card);
componentRegistry.register("CardHeader", CardHeader);
componentRegistry.register("CardTitle", CardTitle);
componentRegistry.register("CardDescription", CardDescription);
componentRegistry.register("CardContent", CardContent);
componentRegistry.register("Repeater", Repeater);
componentRegistry.register("div", "div");
componentRegistry.register("h1", "h1");
componentRegistry.register("h2", "h2");
componentRegistry.register("p", "p");
componentRegistry.register("span", "span");
componentRegistry.register("img", "img");

// Register plugins
pluginRegistry.register(loggerPlugin);
pluginRegistry.register(wrapperPlugin);

// Generate mock users
const generateUsers = () => {
  const names = [
    "Alice Johnson",
    "Bob Smith",
    "Charlie Brown",
    "Diana Prince",
    "Ethan Hunt",
    "Fiona Green",
    "George Wilson",
    "Hannah Lee",
    "Ivan Petrov",
    "Julia Roberts",
  ];

  return names.map((name, i) => ({
    id: i + 1,
    name,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    speed: (Math.random() * 10 + 0.5).toFixed(1),
    lat: 55.7558 + (Math.random() - 0.5) * 0.1,
    lng: 37.6173 + (Math.random() - 0.5) * 0.1,
  }));
};

const store: StoreConfig = {
  state: {
    users: generateUsers(),
    selectedUserId: null as number | null,
  },
  actions: {
    selectUser: (state, userId: number) => {
      state.selectedUserId = userId;
    },
  },
  computed: {
    selectedUser: (state) =>
      state.users.find((u: { id: number }) => u.id === state.selectedUserId) || null,
  },
};

// JSON configuration with store
export const mapPageConfig: AppConfig = {
  store: store,
  ui: {
    type: "div",
    props: {
      style: {
        display: "flex",
        height: "calc(100vh - 73px)",
        overflow: "hidden",
      },
    },
    children: [
      // Left sidebar with user list
      {
        type: "div",
        props: {
          style: {
            width: "400px",
            borderRight: "1px solid #e5e7eb",
            overflowY: "auto",
            padding: "24px",
            backgroundColor: "#f9fafb",
          },
        },
        children: [
          {
            type: "h2",
            props: {
              style: {
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "16px",
              },
            },
            children: "Users",
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              },
            },
            children: [
              {
                type: "Repeater",
                props: {
                  items: "@store.state.users",
                  itemConfig: {
                    type: "Card",
                    props: {
                      style: {
                        cursor: "pointer",
                        transition: "all 0.2s",
                      },
                      onClick: "@store.actions.selectUser",
                    },
                    modifiers: [
                      {
                        conditions: [
                          {
                            path: "item.id",
                            operator: "equals",
                            value: "@store.state.selectedUserId",
                          },
                        ],
                        props: {
                          style: {
                            borderColor: "#3b82f6",
                            backgroundColor: "#eff6ff",
                          },
                        },
                      },
                    ],
                    children: [
                      {
                        type: "CardContent",
                        props: {
                          style: {
                            padding: "16px",
                          },
                        },
                        children: [
                          {
                            type: "div",
                            props: {
                              style: {
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                              },
                            },
                            children: [
                              {
                                type: "img",
                                props: {
                                  src: "@item.avatar",
                                  alt: "@item.name",
                                  style: {
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "50%",
                                    backgroundColor: "#e5e7eb",
                                  },
                                },
                              },
                              {
                                type: "div",
                                props: {
                                  style: {
                                    flex: 1,
                                  },
                                },
                                children: [
                                  {
                                    type: "p",
                                    props: {
                                      style: {
                                        fontWeight: "600",
                                        fontSize: "16px",
                                        marginBottom: "4px",
                                      },
                                    },
                                    children: "@item.name",
                                  },
                                  {
                                    type: "p",
                                    props: {
                                      style: {
                                        fontSize: "14px",
                                        color: "#6b7280",
                                      },
                                    },
                                    children: "@item.speed km/h",
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
              },
            ],
          },
        ],
      },
      // Right side - Map placeholder
      {
        type: "div",
        props: {
          style: {
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f3f4f6",
            position: "relative",
          },
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                textAlign: "center",
                padding: "40px",
              },
            },
            children: [
              {
                type: "h2",
                props: {
                  style: {
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#374151",
                    marginBottom: "16px",
                  },
                },
                children: "Map View",
              },
              {
                type: "p",
                props: {
                  style: {
                    fontSize: "18px",
                    color: "#6b7280",
                    marginBottom: "8px",
                  },
                },
                children: "Selected: @store.computed.selectedUser.name",
              },
              {
                type: "p",
                props: {
                  style: {
                    fontSize: "14px",
                    color: "#9ca3af",
                  },
                },
                children: "Map integration placeholder",
              },
            ],
          },
        ],
      },
    ],
  },
};
