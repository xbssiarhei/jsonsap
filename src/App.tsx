import "./App.css";
import {
  JsonRenderer,
  componentRegistry,
  pluginRegistry,
  type AppConfig,
} from "./lib";
import { Button } from "./components/ui/button";
import { loggerPlugin } from "./lib/plugins/logger";
import { wrapperPlugin } from "./lib/plugins/wrapper";

// Register components
componentRegistry.register("Button", Button);
componentRegistry.register("div", "div");
componentRegistry.register("h1", "h1");
componentRegistry.register("p", "p");
componentRegistry.register("span", "span");

// Register plugins
pluginRegistry.register(loggerPlugin);
pluginRegistry.register(wrapperPlugin);

// JSON configuration with store
const appConfig: AppConfig = {
  store: {
    state: {
      count: 0,
      user: { name: "Guest", role: "visitor" },
      todos: [],
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
      setUserName: (state, name: string) => {
        state.user.name = name;
      },
      addTodo: (state, todo: string) => {
        state.todos.push({ id: Date.now(), text: todo, done: false });
      },
    },
    computed: {
      doubleCount: (state) => state.count * 2,
      userName: (state) => state.user?.name || "Guest",
      userGreeting: (state) => `Hello, ${state.user?.name || "Guest"}!`,
      todoCount: (state) => state.todos?.length || 0,
    },
  },
  ui: {
    type: "div",
    props: {
      style: {
        padding: "40px",
        maxWidth: "800px",
        margin: "0 auto",
      },
    },
    children: [
      {
        type: "h1",
        props: {
          style: { marginBottom: "20px" },
        },
        children: "JSON-Driven Web App with Store",
      },
      {
        type: "p",
        props: {
          style: { marginBottom: "30px", color: "#666" },
        },
        children: "UI rendered from JSON with Valtio state management",
      },
      {
        type: "div",
        props: {
          style: {
            padding: "20px",
            backgroundColor: "#f0f9ff",
            borderRadius: "8px",
            marginBottom: "30px",
          },
        },
        children: [
          {
            type: "h1",
            props: {
              style: { fontSize: "18px", marginBottom: "15px" },
            },
            children: "@store.computed.userGreeting",
          },
          {
            type: "p",
            props: {
              style: { marginBottom: "10px" },
            },
            children: "Count: @store.state.count",
          },
          {
            type: "p",
            props: {
              style: { marginBottom: "20px", color: "#666" },
            },
            children: "Double Count: @store.computed.doubleCount",
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                gap: "10px",
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
      {
        type: "div",
        props: {
          style: {
            padding: "20px",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            marginTop: "20px",
          },
        },
        children: [
          {
            type: "h1",
            props: {
              style: { fontSize: "18px", marginBottom: "10px" },
            },
            children: "Features:",
          },
          {
            type: "p",
            children: "✓ Valtio-powered reactive state management",
          },
          {
            type: "p",
            children: "✓ @store.* syntax for accessing state, actions, and computed",
          },
          {
            type: "p",
            children: "✓ Automatic re-rendering on state changes",
          },
          {
            type: "p",
            children: "✓ Computed properties with memoization",
          },
          {
            type: "p",
            children: "✓ Clean separation of UI and store configuration",
          },
        ],
      },
      {
        type: "div",
        props: {
          style: {
            marginTop: "30px",
            padding: "20px",
            border: "2px solid #ddd",
            borderRadius: "8px",
          },
        },
        children: [
          {
            type: "h1",
            props: {
              style: { fontSize: "18px", marginBottom: "10px" },
            },
            children: "User Info",
          },
          {
            type: "p",
            props: {
              style: { marginBottom: "10px" },
            },
            children: "Name: @store.state.user.name",
          },
          {
            type: "p",
            props: {
              style: { marginBottom: "15px" },
            },
            children: "Role: @store.state.user.role",
          },
          {
            type: "Button",
            props: {
              variant: "outline",
              onClick: "@store.actions.setUserName",
            },
            children: "Change Name (Demo)",
          },
        ],
      },
    ],
  },
};

function App() {
  return <JsonRenderer config={appConfig} />;
}

export default App;
