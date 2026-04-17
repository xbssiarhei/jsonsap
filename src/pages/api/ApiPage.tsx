import {
  pluginRegistry,
  type StoreConfig,
  type AppConfig,
} from "../../lib";
import { loggerPlugin } from "../../lib/plugins/logger";
import { wrapperPlugin } from "../../lib/plugins/wrapper";

// Register plugins
pluginRegistry.register(loggerPlugin);
pluginRegistry.register(wrapperPlugin);

export type ApiState = {
  posts: Array<{
    userId: number;
    id: number;
    title: string;
    body: string;
  }>;
  users: Array<{
    id: number;
    name: string;
    email: string;
    company: { name: string };
  }>;
  selectedUserId: number | null;
  isLoading: boolean;
  error: string | null;
};

const store: StoreConfig<ApiState> = {
  state: {
    posts: [],
    users: [],
    selectedUserId: null,
    isLoading: false,
    error: null,
  },
  actions: {
    fetchPosts: async (state) => {
      state.isLoading = true;
      state.error = null;
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts",
        );
        const data = await response.json();
        state.posts = data.slice(0, 42); // Limit to 42 posts
        state.isLoading = false;
      } catch (error) {
        state.error =
          error instanceof Error ? error.message : "Failed to fetch posts";
        state.isLoading = false;
      }
    },
    fetchUsers: async (state) => {
      state.isLoading = true;
      state.error = null;
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users",
        );
        const data = await response.json();
        state.users = data;
        state.isLoading = false;
      } catch (error) {
        state.error =
          error instanceof Error ? error.message : "Failed to fetch users";
        state.isLoading = false;
      }
    },
    selectUser: (state, _e: unknown, userId) => {
      state.selectedUserId = userId as unknown as number;
    },
  },
  computed: {
    filteredPosts: (state) => {
      if (!state.selectedUserId) return state.posts;
      return (state.posts as Array<{ userId: number }>).filter(
        (post) => post.userId === state.selectedUserId,
      );
    },
    selectedUser: (state) => {
      if (!state.selectedUserId) return null;
      return (state.users as Array<{ id: number }>).find(
        (user) => user.id === state.selectedUserId,
      );
    },
  },
};

// JSON configuration with store
export const apiPageConfig: AppConfig<ApiState> = {
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
                marginBottom: "16px",
              },
            },
            children: "JSONPlaceholder API Demo",
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
            children:
              "Fetching data from JSONPlaceholder API using JSON configuration",
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                gap: "12px",
              },
            },
            children: [
              {
                type: "Button",
                props: {
                  variant: "default",
                  onClick: "@store.actions.fetchPosts",
                },
                children: "Load Posts",
              },
              {
                type: "Button",
                props: {
                  variant: "outline",
                  onClick: "@store.actions.fetchUsers",
                },
                children: "Load Users",
              },
            ],
          },
        ],
      },
      // Loading state
      {
        type: "div",
        props: {
          style: {
            marginBottom: "24px",
          },
        },
        children: [
          {
            type: "p",
            props: {
              style: {
                fontSize: "14px",
                color: "#666",
              },
            },
            children: "Loading: @store.state.isLoading",
          },
        ],
      },
      // Users section
      {
        type: "div",
        props: {
          style: {
            marginBottom: "32px",
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
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "12px",
              },
            },
            children: [
              {
                type: "Repeater",
                props: {
                  items: "@store.state.users",
                  template: {
                    type: "Card",
                    props: {
                      style: {
                        cursor: "pointer",
                        transition: "all 0.2s",
                      },
                      onClick: "@store.actions.selectUser",
                      item: "@item.id",
                    },
                    // actionPass: {
                    //   onClick: "@item.id",
                    // },
                    // actions: {
                    //   onClick: {
                    //     action: "@store.actions.selectUser",
                    //     pass: "@item.id",
                    //   },
                    // },
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
                        type: "CardHeader",
                        children: [
                          {
                            type: "CardTitle",
                            props: {
                              style: {
                                fontSize: "16px",
                              },
                            },
                            children: "@item.name",
                          },
                          {
                            type: "CardDescription",
                            children: "@item.email",
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
                                fontSize: "14px",
                                color: "#666",
                              },
                            },
                            children: "@item.company.name",
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
      // Posts section
      {
        type: "div",
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
            children: "Posts",
          },
          {
            type: "p",
            props: {
              style: {
                fontSize: "14px",
                color: "#666",
                marginBottom: "16px",
              },
            },
            children: "Showing posts from: @store.computed.selectedUser.name",
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              },
            },
            children: [
              {
                type: "Repeater",
                props: {
                  items: "@store.computed.filteredPosts",
                  template: {
                    type: "Card",
                    children: [
                      {
                        type: "CardHeader",
                        children: [
                          {
                            type: "CardTitle",
                            children: "@item.title",
                          },
                          {
                            type: "CardDescription",
                            children: "Post #@item.id by User #@item.userId",
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
                                color: "#666",
                              },
                            },
                            children: "@item.body",
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
