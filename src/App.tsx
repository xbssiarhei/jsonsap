import "./App.css";
import {
  JsonRenderer,
  componentRegistry,
  pluginRegistry,
  type AppConfig,
  type StoreConfig,
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
componentRegistry.register("input", "input");

// Register a TodoItem component
interface Todo {
  id: number;
  text: string;
  done: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
}

const TodoItem = ({ todo, onToggle, onRemove }: TodoItemProps) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "8px",
      backgroundColor: todo.done ? "#f0fdf4" : "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "6px",
    }}
  >
    <input
      type="checkbox"
      checked={todo.done}
      onChange={() => onToggle(todo.id)}
      style={{ cursor: "pointer" }}
    />
    <span
      style={{
        flex: 1,
        textDecoration: todo.done ? "line-through" : "none",
        color: todo.done ? "#6b7280" : "#000",
      }}
    >
      {todo.text}
    </span>
    <Button variant="outline" size="sm" onClick={() => onRemove(todo.id)}>
      Remove
    </Button>
  </div>
);

// TodoList component that renders array of todos
interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
}

const TodoList = ({ todos, onToggle, onRemove }: TodoListProps) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    }}
  >
    {todos && todos.length > 0 ? (
      todos.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onRemove={onRemove}
        />
      ))
    ) : (
      <p style={{ color: "#6b7280", fontStyle: "italic" }}>
        No todos yet. Add one!
      </p>
    )}
  </div>
);

componentRegistry.register("TodoItem", TodoItem);
componentRegistry.register("TodoList", TodoList);

// Register plugins
pluginRegistry.register(loggerPlugin);
pluginRegistry.register(wrapperPlugin);

const store: StoreConfig = {
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
const appConfig: AppConfig = {
  store: store,
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
        plugins: ["wrapper"],
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
            children:
              "✓ @store.* syntax for accessing state, actions, and computed",
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
      {
        type: "div",
        props: {
          style: {
            marginTop: "30px",
            padding: "20px",
            backgroundColor: "#f0f9ff",
            border: "2px solid #3b82f6",
            borderRadius: "8px",
          },
        },
        children: [
          {
            type: "h1",
            props: {
              style: { fontSize: "18px", marginBottom: "15px" },
            },
            children: "Todo List Example (Array Operations)",
          },
          {
            type: "p",
            props: {
              style: { marginBottom: "10px", color: "#666" },
            },
            children:
              "Total: @store.computed.todoCount | Active: @store.computed.activeCount | Completed: @store.computed.completedCount",
          },
          {
            type: "div",
            props: {
              style: {
                marginBottom: "15px",
              },
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
};

function App() {
  return <JsonRenderer config={appConfig} />;
}

export default App;
