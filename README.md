# JSON-Driven Web App Builder (jsonsap)

A React library that renders applications from JSON configuration with extensible component mapping, plugin system, and conditional modifiers.

## Features

- **JSON Configuration**: Define your entire UI structure using JSON with separated UI and Store sections
- **Component Registry**: Extensible mapping of component names to React components
- **Plugin System**: Hook into the rendering lifecycle with `beforeRender` and `afterRender` plugins
- **State Management**: Built-in store configuration with Valtio for reactive state
- **Modifiers System**: Conditional prop modifications based on data thresholds
- **Repeater Component**: Universal array rendering with `@item.*` syntax
- **Live Config Editor**: Built-in UI for editing JSON configuration on the fly
- **Type-Safe**: Full TypeScript support

## Installation

```bash
npm install
npm run dev
```

## Configuration Architecture

The library uses a two-part configuration model:

### UI Section

Defines the visual structure and component tree:

- Component hierarchy and nesting
- Component types and props
- Layout and styling
- Event handlers (references to store actions)
- Plugin assignments per component

### Store Section

Defines application state and logic:

- State variables and initial values
- Actions/handlers for state mutations
- Computed values/getters
- Side effects and async operations
- State persistence rules

This separation enables:

- Clear separation of concerns (presentation vs logic)
- Reusable UI components with different state
- Easier testing of UI and logic independently
- State management flexibility
- Better code organization for large applications

## Quick Start

```typescript
import { JsonRenderer, componentRegistry, pluginRegistry } from './lib';
import { Button } from './components/ui/button';

// 1. Register components
componentRegistry.register('Button', Button);
componentRegistry.register('div', 'div');

// 2. Create JSON configuration
const config = {
  store: {
    state: {
      count: 0
    },
    actions: {
      increment: 'count++'
    }
  },
  ui: {
    type: 'div',
    children: [
      {
        type: 'Button',
        props: {
          variant: 'default',
          onClick: '@store.actions.increment'
        },
        children: '@store.state.count'
      }
    ]
  }
};

// 3. Render
function App() {
  return <JsonRenderer config={config} />;
}
```

## Store Configuration Format

### Full Configuration Structure

```typescript
interface AppConfig {
  store?: {
    state: Record<string, unknown>;
    actions?: Record<string, (state: any, ...args: any[]) => void>;
    computed?: Record<string, (state: any) => unknown>;
  };
  ui: ComponentConfig;
}
```

**Important Notes:**

- Actions and computed properties are **functions**, not JSON strings
- The library uses **Valtio** for reactive state management
- Computed properties use **derive-valtio** (not the deprecated valtio/utils derive)
- State updates are automatically tracked and trigger re-renders

### UI Configuration Example

```json
{
  "type": "Button",
  "props": {
    "variant": "default",
    "onClick": "@store.actions.handleClick"
  },
  "plugins": ["logger"],
  "children": "@store.state.buttonText"
}
```

### Store Configuration Example

```typescript
const config = {
  store: {
    state: {
      count: 0,
      user: { name: "Guest", email: "guest@example.com" },
      isLoading: false,
    },
    actions: {
      increment: (state) => {
        state.count++;
      },
      decrement: (state) => {
        state.count--;
      },
      setUser: (state, user) => {
        state.user = user;
      },
      toggleLoading: (state) => {
        state.isLoading = !state.isLoading;
      },
    },
    computed: {
      doubleCount: (state) => state.count * 2,
      userName: (state) => state.user?.name || "Guest",
      userEmail: (state) => state.user?.email || "No email",
      isEven: (state) => state.count % 2 === 0,
    },
  },
};
```

**Key Points:**

- State is a plain object with initial values
- Actions are functions that receive state as first parameter
- Actions can mutate state directly (Valtio handles immutability)
- Computed properties are functions that derive values from state
- Computed values are automatically memoized and reactive

## Component Registry

Register components to make them available in JSON configs:

```typescript
import { componentRegistry } from "./lib";
import { Button } from "./components/ui/button";

// Register custom component
componentRegistry.register("Button", Button);

// Register HTML elements
componentRegistry.register("div", "div");
componentRegistry.register("span", "span");

// Check if component exists
if (componentRegistry.has("Button")) {
  // ...
}

// Unregister component
componentRegistry.unregister("Button");
```

## Plugin System

Plugins can modify components before or after rendering.

### Plugin Interface

```typescript
interface Plugin {
  name: string;
  beforeRender?: (
    config: ComponentConfig,
    context: PluginContext,
  ) => ComponentConfig;
  afterRender?: (
    element: ReactElement,
    config: ComponentConfig,
    context: PluginContext,
  ) => ReactElement;
}
```

### Creating a Plugin

```typescript
import { Plugin } from "./lib";

const loggerPlugin: Plugin = {
  name: "logger",
  beforeRender: (config, context) => {
    console.log("Rendering:", config.type);
    return config;
  },
};

// Register plugin
pluginRegistry.register(loggerPlugin);
```

### Using Plugins

```typescript
const config = {
  type: "Button",
  plugins: ["logger", "wrapper"], // Apply multiple plugins
  children: "Click me",
};
```

### Built-in Example Plugins

#### Logger Plugin

Logs component rendering to console:

```typescript
import { loggerPlugin } from "./lib/plugins/logger";
pluginRegistry.register(loggerPlugin);
```

#### Wrapper Plugin

Wraps components in a styled div:

```typescript
import { wrapperPlugin } from "./lib/plugins/wrapper";
pluginRegistry.register(wrapperPlugin);
```

## Advanced Usage

### Connecting UI to Store

Use `@store.*` syntax to reference store values in UI configuration. The library supports two modes:

#### 1. Direct Reference (returns value)

When the entire string is a store reference, it returns the actual value:

```json
{
  "type": "p",
  "children": "@store.state.count"
}
```

#### 2. String Interpolation (embeds value in text)

When store references are part of a larger string, they are interpolated:

```json
{
  "type": "p",
  "children": "Count: @store.state.count"
}
```

#### 3. Multiple References

You can use multiple store references in one string:

```json
{
  "type": "p",
  "children": "User: @store.state.user.name, Count: @store.state.count, Double: @store.computed.doubleCount"
}
```

#### 4. Nested Paths

Access nested properties using dot notation:

```json
{
  "type": "p",
  "children": "Welcome, @store.state.user.name!"
}
```

### Full Example with Store

```json
{
  "store": {
    "state": {
      "count": 0,
      "user": { "name": "Guest" }
    },
    "actions": {
      "increment": "Function: (state) => { state.count++; }",
      "setUser": "Function: (state, name) => { state.user.name = name; }"
    },
    "computed": {
      "doubleCount": "Function: (state) => state.count * 2",
      "greeting": "Function: (state) => `Hello, ${state.user.name}!`"
    }
  },
  "ui": {
    "type": "div",
    "children": [
      {
        "type": "h1",
        "children": "@store.computed.greeting"
      },
      {
        "type": "p",
        "children": "Count: @store.state.count (Double: @store.computed.doubleCount)"
      },
      {
        "type": "Button",
        "props": {
          "onClick": "@store.actions.increment"
        },
        "children": "Increment"
      }
    ]
  }
}
```

### Nested Components

```typescript
const config = {
  ui: {
    type: "div",
    children: [
      {
        type: "h1",
        children: "Title",
      },
      {
        type: "Button",
        props: { variant: "default" },
        children: "Action",
      },
    ],
  },
};
```

### Dynamic Props with State

```typescript
function App() {
  const [count, setCount] = useState(0);

  const config = {
    ui: {
      type: 'Button',
      props: {
        onClick: () => setCount(count + 1)
      },
      children: `Count: ${count}`
    }
  };

  return <JsonRenderer config={config} />;
}
```

### Custom Plugin Context

```typescript
<JsonRenderer
  config={config}
  context={{
    userId: '123',
    theme: 'dark'
  }}
/>
```

Access context in plugins:

```typescript
const themePlugin: Plugin = {
  name: "theme",
  beforeRender: (config, context) => {
    if (context.theme === "dark") {
      config.props = {
        ...config.props,
        className: "dark-mode",
      };
    }
    return config;
  },
};
```

## API Reference

### `JsonRenderer`

Main component for rendering JSON configurations.

**Props:**

- `config: ComponentConfig | AppConfig` - JSON configuration object (with optional store)
- `context?: Partial<PluginContext>` - Optional context passed to plugins

### `componentRegistry`

Singleton for managing component mappings.

**Methods:**

- `register(name: string, component: ComponentType)` - Register a component
- `get(name: string)` - Get a registered component
- `has(name: string)` - Check if component exists
- `unregister(name: string)` - Remove a component
- `clear()` - Remove all components

### `pluginRegistry`

Singleton for managing plugins.

**Methods:**

- `register(plugin: Plugin)` - Register a plugin
- `get(name: string)` - Get a registered plugin
- `has(name: string)` - Check if plugin exists
- `unregister(name: string)` - Remove a plugin

## Examples

See `src/App.tsx` for a complete working example with:

- Multiple component types
- Plugin usage
- Dynamic state integration
- Nested component structures

See `example-config.json` for a sample JSON configuration file.

## Future Development

The library supports:

- Reactive state management with Valtio
- `@store.*` syntax for connecting UI to state with string interpolation
- Computed properties with derive-valtio
- Conditional modifiers for dynamic styling
- Array rendering with Repeater component
- Live configuration editing
- Developer tools for debugging

## Modifiers System

Modifiers allow conditional prop modifications based on data values (thresholds).

### Modifier Configuration

```typescript
interface Modifier {
  conditions: ModifierCondition[];
  props: Record<string, unknown>;
  matchAll?: boolean; // true = AND, false = OR (default: true)
}

interface ModifierCondition {
  path: string; // "status", "item.value", "@store.state.theme"
  operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
  value: unknown;
}
```

### Example Usage

```json
{
  "type": "Card",
  "props": {
    "item": "@item"
  },
  "modifiers": [
    {
      "conditions": [
        {
          "path": "item.status",
          "operator": "equals",
          "value": "active"
        }
      ],
      "props": {
        "style": {
          "backgroundColor": "#dcfce7",
          "borderColor": "#22c55e"
        }
      }
    },
    {
      "conditions": [
        {
          "path": "item.value",
          "operator": "greaterThan",
          "value": 75
        }
      ],
      "props": {
        "style": {
          "borderWidth": "2px",
          "borderColor": "#ef4444"
        }
      }
    }
  ]
}
```

### Supported Operators

- `equals`: Exact match (`===`)
- `notEquals`: Not equal (`!==`)
- `greaterThan`: Numeric comparison (`>`)
- `lessThan`: Numeric comparison (`<`)
- `contains`: String includes or array contains

### Path Resolution

- Direct props: `"status"` → `props.status`
- Nested paths: `"item.user.name"` → `props.item.user.name`
- Store references: `"@store.state.theme"` → `store.state.theme`

### Prop Merging

- **style**: Deep merged with base styles
- **className**: Concatenated with base classes
- **other props**: Direct override

## Repeater Component

Universal component for rendering arrays from JSON configuration.

### Basic Usage

```json
{
  "type": "Repeater",
  "props": {
    "items": "@store.state.items",
    "itemConfig": {
      "type": "Card",
      "props": {
        "title": "@item.name",
        "description": "@item.description"
      }
    }
  }
}
```

### @item.\* Syntax

- Direct reference: `"@item"` → entire item object
- Property access: `"@item.name"` → `item.name`
- Nested paths: `"@item.user.email"` → `item.user.email`
- String interpolation: `"Item #@item.id: @item.name"`

### With Modifiers

```json
{
  "type": "Repeater",
  "props": {
    "items": "@store.state.todos",
    "itemConfig": {
      "type": "TodoItem",
      "props": {
        "item": "@item"
      },
      "modifiers": [
        {
          "conditions": [
            { "path": "item.completed", "operator": "equals", "value": true }
          ],
          "props": {
            "className": "opacity-50 line-through"
          }
        }
      ]
    }
  }
}
```

## Live Config Editor

Built-in component for editing JSON configuration at runtime.

### Usage

```typescript
import { ConfigEditor } from './components/ConfigEditor';
import { useState } from 'react';

function App() {
  const [config, setConfig] = useState(initialConfig);

  return (
    <div>
      <ConfigEditor config={config} onConfigChange={setConfig} />
      <JsonRenderer config={config} />
    </div>
  );
}
```

### Features

- Dialog-based editor with syntax highlighting
- Real-time JSON validation
- Error messages for invalid JSON
- Preserves store configuration (only edits UI section)
- Immediate preview of changes

## License

MIT

## Component Registry

Register components to make them available in JSON configs:

```typescript
import { componentRegistry } from "./lib";
import { Button } from "./components/ui/button";

// Register custom component
componentRegistry.register("Button", Button);

// Register HTML elements
componentRegistry.register("div", "div");
componentRegistry.register("span", "span");

// Check if component exists
if (componentRegistry.has("Button")) {
  // ...
}

// Unregister component
componentRegistry.unregister("Button");
```

## Plugin System

Plugins can modify components before or after rendering.

### Plugin Interface

```typescript
interface Plugin {
  name: string;
  beforeRender?: (
    config: ComponentConfig,
    context: PluginContext,
  ) => ComponentConfig;
  afterRender?: (
    element: ReactElement,
    config: ComponentConfig,
    context: PluginContext,
  ) => ReactElement;
}
```

### Creating a Plugin

```typescript
import { Plugin } from "./lib";

const loggerPlugin: Plugin = {
  name: "logger",
  beforeRender: (config, context) => {
    console.log("Rendering:", config.type);
    return config;
  },
};

// Register plugin
pluginRegistry.register(loggerPlugin);
```

### Using Plugins

```typescript
const config = {
  type: "Button",
  plugins: ["logger", "wrapper"], // Apply multiple plugins
  children: "Click me",
};
```

### Built-in Example Plugins

#### Logger Plugin

Logs component rendering to console:

```typescript
import { loggerPlugin } from "./lib/plugins/logger";
pluginRegistry.register(loggerPlugin);
```

#### Wrapper Plugin

Wraps components in a styled div:

```typescript
import { wrapperPlugin } from "./lib/plugins/wrapper";
pluginRegistry.register(wrapperPlugin);
```

## Advanced Usage

### Nested Components

```typescript
const config = {
  type: "div",
  children: [
    {
      type: "h1",
      children: "Title",
    },
    {
      type: "Button",
      props: { variant: "default" },
      children: "Action",
    },
  ],
};
```

### Dynamic Props with State

```typescript
function App() {
  const [count, setCount] = useState(0);

  const config = {
    type: 'Button',
    props: {
      onClick: () => setCount(count + 1)
    },
    children: `Count: ${count}`
  };

  return <JsonRenderer config={config} />;
}
```

### Custom Plugin Context

```typescript
<JsonRenderer
  config={config}
  context={{
    userId: '123',
    theme: 'dark'
  }}
/>
```

Access context in plugins:

```typescript
const themePlugin: Plugin = {
  name: "theme",
  beforeRender: (config, context) => {
    if (context.theme === "dark") {
      config.props = {
        ...config.props,
        className: "dark-mode",
      };
    }
    return config;
  },
};
```

## API Reference

### `JsonRenderer`

Main component for rendering JSON configurations.

**Props:**

- `config: ComponentConfig` - JSON configuration object
- `context?: Partial<PluginContext>` - Optional context passed to plugins

### `componentRegistry`

Singleton for managing component mappings.

**Methods:**

- `register(name: string, component: ComponentType)` - Register a component
- `get(name: string)` - Get a registered component
- `has(name: string)` - Check if component exists
- `unregister(name: string)` - Remove a component
- `clear()` - Remove all components

### `pluginRegistry`

Singleton for managing plugins.

**Methods:**

- `register(plugin: Plugin)` - Register a plugin
- `get(name: string)` - Get a registered plugin
- `has(name: string)` - Check if plugin exists
- `unregister(name: string)` - Remove a plugin

## Examples

See `src/App.tsx` for a complete working example with:

- Multiple component types
- Plugin usage
- Dynamic state integration
- Nested component structures

## License

MIT
