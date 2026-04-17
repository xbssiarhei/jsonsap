import {
  componentRegistry,
  pluginRegistry,
  type AppConfig,
  type StoreConfig,
} from "../../lib";
import { loggerPlugin } from "../../lib/plugins/logger";
import { wrapperPlugin } from "../../lib/plugins/wrapper";
import { TodoItem, TodoList } from "../../components/TodoComponents";

// Register page-specific components
componentRegistry.register("TodoItem", TodoItem);
componentRegistry.register("TodoList", TodoList);

// Register plugins
pluginRegistry.register(loggerPlugin);
pluginRegistry.register(wrapperPlugin);

type DemoState = {
  count: number;
  user: {
    name: string;
    role: string;
  };
  todos: {
    id: number;
    text: string;
    done: boolean;
  }[];
};

const store: StoreConfig<DemoState> = {
  state: {
    count: 0,
    user: { name: "Guest", role: "visitor" },
    todos: [
      { id: 1, text: "Learn jsonsap", done: false },
      { id: 2, text: "Build an app", done: false },
    ],
  },
  actions: {
    increment: (state) => {
      state.count++;
    },
    decrement: (state) => {
      state.count--;
    },
    reset: (state) => {
      state.count = 0;
    },
    setUserName: (state, _e, name: string) => {
      state.user.name = name ?? "unknow";
    },
    addTodo: (state, _e, text: string) => {
      state.todos.push({
        id: Date.now(),
        text: text || `New todo ${state.todos.length + 1}`,
        done: false,
      });
    },
    toggleTodo: (state, id: number) => {
      const todo = state.todos.find((t) => t.id === id);
      if (todo) {
        todo.done = !todo.done;
      }
    },
    removeTodo: (state, id: number) => {
      const index = state.todos.findIndex((t) => t.id === id);
      if (index !== -1) {
        state.todos.splice(index, 1);
      }
    },
  },
  computed: {
    doubleCount: (state) => state.count * 2,
    userName: (state) => state.user?.name || "Guest",
    userGreeting: (state) => `Hello, ${state.user?.name || "Guest"}!`,
    todoCount: (state) => state.todos?.length || 0,
    completedCount: (state) => state.todos?.filter((t) => t.done).length || 0,
    activeCount: (state) => state.todos?.filter((t) => !t.done).length || 0,
  },
};

// JSON configuration with store
export const demoPageConfig: AppConfig<DemoState> = {
  store: store,
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
        children: "JSON-Driven Web App Demo",
      },
      {
        type: "p",
        props: {
          style: { fontSize: "18px", color: "#666", marginBottom: "40px" },
        },
        children:
          "Interactive examples of reactive state management with Valtio",
      },
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
                    children: "@store.computed.userGreeting",
                  },
                  {
                    type: "CardDescription",
                    children: "Counter with reactive state",
                  },
                ],
              },
              {
                type: "CardContent",
                children: [
                  {
                    type: "div",
                    props: {
                      style: { marginBottom: "16px" },
                    },
                    children: [
                      {
                        type: "p",
                        props: {
                          style: {
                            fontSize: "32px",
                            fontWeight: "bold",
                            marginBottom: "8px",
                          },
                        },
                        children: "@store.state.count",
                      },
                      {
                        type: "p",
                        props: {
                          style: { color: "#666", fontSize: "14px" },
                        },
                        children: "Double: @store.computed.doubleCount",
                      },
                    ],
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                      },
                    },
                    children: [
                      {
                        type: "Button",
                        props: {
                          variant: "default",
                          onClick: "@store.actions.increment",
                        },
                        plugins: ["logger"],
                        children: "Increment",
                      },
                      {
                        type: "Button",
                        props: {
                          variant: "outline",
                          onClick: "@store.actions.decrement",
                        },
                        plugins: ["logger"],
                        children: "Decrement",
                      },
                      {
                        type: "Button",
                        props: {
                          variant: "secondary",
                          onClick: "@store.actions.reset",
                        },
                        children: "Reset",
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
                    children: "User Information",
                  },
                  {
                    type: "CardDescription",
                    children: "Nested state access",
                  },
                ],
              },
              {
                type: "CardContent",
                children: [
                  {
                    type: "div",
                    props: {
                      style: { marginBottom: "16px" },
                    },
                    children: [
                      {
                        type: "p",
                        props: {
                          style: { marginBottom: "8px" },
                        },
                        children: "Name: @store.state.user.name",
                      },
                      {
                        type: "p",
                        props: {
                          style: { color: "#666" },
                        },
                        children: "Role: @store.state.user.role",
                      },
                    ],
                  },
                  {
                    type: "Button",
                    props: {
                      variant: "outline",
                      onClick: "@store.actions.setUserName",
                    },
                    children: "Change Name",
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
          style: { marginTop: "24px" },
        },
        children: [
          {
            type: "CardHeader",
            children: [
              {
                type: "CardTitle",
                children: "Todo List (Array Operations)",
              },
              {
                type: "CardDescription",
                children:
                  "Total: @store.computed.todoCount | Active: @store.computed.activeCount | Completed: @store.computed.completedCount",
              },
            ],
          },
          {
            type: "CardContent",
            children: [
              {
                type: "div",
                props: {
                  style: { marginBottom: "16px" },
                },
                children: [
                  {
                    type: "Button",
                    props: {
                      variant: "default",
                      onClick: "@store.actions.addTodo",
                    },
                    children: "Add Todo",
                  },
                ],
              },
              {
                type: "TodoList",
                props: {
                  todos: "@store.state.todos",
                  onToggle: "@store.actions.toggleTodo",
                  onRemove: "@store.actions.removeTodo",
                },
              },
            ],
          },
        ],
      },
    ],
  },
};
