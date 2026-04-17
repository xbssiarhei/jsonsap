# JSON-Driven Web App Builder (jsonsap)

A React library that renders applications from JSON configuration with extensible component mapping, plugin system, conditional modifiers, and automatic form binding.

## Features

- **JSON Configuration**: Define your entire UI structure using JSON with separated UI and Store sections
- **Component Registry**: Extensible mapping of component names to React components
- **Plugin System**: Hook into the rendering lifecycle with `beforeRender` and `afterRender` plugins
- **State Management**: Built-in store configuration with Valtio for reactive state
- **Modifiers System**: Conditional prop modifications based on data thresholds with store references
- **Repeater Component**: Universal array rendering with `@item.*` syntax and full event handler support
- **AutoBind Plugin**: Automatic form input binding to store state
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

### Store References in Condition Values

Modifiers support `@store.*` references in condition values for dynamic thresholds:

```json
{
  "modifiers": [
    {
      "conditions": [
        {
          "path": "item.value",
          "operator": "greaterThan",
          "value": "@store.state.threshold"
        }
      ],
      "props": {
        "style": { "backgroundColor": "#fee" }
      }
    }
  ]
}
```

This allows users to change thresholds dynamically through the UI, and all modifiers will update automatically.

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
    "template": {
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
    "template": {
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

### With Event Handlers

The Repeater component fully supports event handlers with automatic item data passing:

**onClick Example:**

```json
{
  "type": "Repeater",
  "props": {
    "items": "@store.state.users",
    "template": {
      "type": "Card",
      "props": {
        "onClick": "@store.actions.selectUser",
        "item": "@item.id"
      }
    }
  }
}
```

**onChange Example:**

```json
{
  "type": "Repeater",
  "props": {
    "items": "@store.state.items",
    "template": {
      "type": "Input",
      "props": {
        "value": "@item.value",
        "onChange": "@store.actions.updateItem",
        "item": "@item.id"
      }
    }
  }
}
```

The resolver automatically wraps event handlers to pass:

- For onClick: `(event, itemId)`
- For onChange: `(event, itemId, event.target.value)`

Your action receives:

```typescript
updateItem: (state, _event, itemId, newValue) => {
  const item = state.items.find((i) => i.id === itemId);
  if (item) item.value = newValue;
};
```

## AutoBind Plugin

Automatically creates onChange handlers for form inputs, eliminating the need for manual event handler setup.

### Usage

```typescript
import { autoBindPlugin } from "./lib";

// Register the plugin
pluginRegistry.register(autoBindPlugin);
```

### Configuration

```json
{
  "type": "Input",
  "props": {
    "value": "@store.state.username",
    "autoBind": "username"
  },
  "plugins": ["autoBind"]
}
```

### Features

- **Automatic onChange creation**: No need to write onChange handlers
- **Nested path support**: `autoBind: "user.email"` works with nested state
- **Checkbox support**: Automatically uses `checked` for checkbox inputs
- **Type detection**: Handles different input types appropriately

### Example

```typescript
const store = {
  state: {
    username: "",
    email: "",
    settings: {
      notifications: false,
    },
  },
};

const config = {
  ui: {
    type: "div",
    children: [
      {
        type: "Input",
        props: {
          type: "text",
          value: "@store.state.username",
          autoBind: "username",
        },
        plugins: ["autoBind"],
      },
      {
        type: "Checkbox",
        props: {
          checked: "@store.state.settings.notifications",
          autoBind: "settings.notifications",
        },
        plugins: ["autoBind"],
      },
    ],
  },
};
```

The plugin automatically:

1. Creates an onChange (or onCheckedChange for checkboxes) handler
2. Updates the store state at the specified path
3. Removes the `autoBind` prop from final component props

Built-in component for editing JSON configuration at runtime.

## SetAction Syntax

Declarative state updates for onClick and onChange handlers without writing action functions.

### Usage

```json
{
  "type": "Button",
  "props": {
    "onClick": {
      "$action": "set",
      "path": "selectedItem",
      "value": "@item.id"
    }
  }
}
```

### Configuration

```typescript
interface SetAction {
  $action: "set";
  store?: string; // Optional store name (for future multi-store support)
  path: string; // Path in store state, e.g., "firstName" or "user.name"
  value?: unknown; // Optional explicit value (can be @item.* reference)
  then?: string; // Optional action to call after setting value
}
```

### Features

- **Declarative updates**: No need to write action functions for simple state updates
- **Explicit values**: Pass specific values including `@item.*` references from Repeater
- **Action chaining**: Use `then` parameter to call an action after state update
- **Works with onClick and onChange**: Supports both event types
- **Automatic value extraction**: For onChange without explicit value, extracts from event.target.value

### Examples

**Simple onChange:**

```json
{
  "type": "Input",
  "props": {
    "value": "@store.state.firstName",
    "onChange": {
      "$action": "set",
      "path": "firstName"
    }
  }
}
```

**onClick with explicit value from Repeater:**

```json
{
  "type": "Repeater",
  "props": {
    "items": "@store.state.queries",
    "template": {
      "type": "Button",
      "props": {
        "onClick": {
          "$action": "set",
          "path": "query",
          "value": "@item.query",
          "then": "applyFilter"
        }
      },
      "children": "@item.label"
    }
  }
}
```

**With action chaining:**

```json
{
  "type": "Input",
  "props": {
    "value": "@store.state.searchTerm",
    "onChange": {
      "$action": "set",
      "path": "searchTerm",
      "then": "performSearch"
    }
  }
}
```

The `then` parameter calls the specified action after updating state, enabling workflows like "set value then filter" or "set value then validate".

## ControlledInput Component

Solves cursor jumping issue in text inputs caused by React re-renders during typing.

### Problem

Standard controlled inputs in JSON configuration can cause cursor to jump to end when typing, because the entire component tree re-renders on every state change.

### Solution

`ControlledInput` uses internal state to maintain cursor position while syncing with store state.

### Usage

```json
{
  "type": "ControlledInput",
  "props": {
    "value": "@store.state.query",
    "onChange": {
      "$action": "set",
      "path": "query"
    },
    "placeholder": "Enter query..."
  }
}
```

### How It Works

1. Maintains internal state for the input value
2. Sets `isTyping` flag when user types
3. Updates store immediately via onChange
4. Only syncs from store when NOT typing
5. Preserves cursor position during typing

### When to Use

- Text inputs where cursor position matters (search boxes, query editors)
- Inputs that update frequently
- Any input where users report cursor jumping

### When NOT to Use

- Simple forms with infrequent updates
- Inputs with autoBind plugin (already handles cursor correctly)
- Non-text inputs (checkboxes, selects)

## Popover Component

shadcn/ui Popover component for displaying additional information on click.

### Usage

```json
{
  "type": "Popover",
  "children": [
    {
      "type": "PopoverTrigger",
      "props": {
        "asChild": true
      },
      "children": [
        {
          "type": "Button",
          "children": "Open Details"
        }
      ]
    },
    {
      "type": "PopoverContent",
      "props": {
        "className": "w-80"
      },
      "children": [
        {
          "type": "div",
          "children": "Popover content here"
        }
      ]
    }
  ]
}
```

### Features

- **Accessible**: Built on Radix UI primitives
- **Customizable**: Full control over trigger and content
- **Works with Repeater**: Use `@item.*` syntax in popover content
- **Supports modifiers**: Apply conditional styling to PopoverContent

### Example with Repeater

```json
{
  "type": "Repeater",
  "props": {
    "items": "@store.state.items",
    "template": {
      "type": "Popover",
      "children": [
        {
          "type": "PopoverTrigger",
          "children": [
            {
              "type": "Card",
              "children": "Item #@item.id"
            }
          ]
        },
        {
          "type": "PopoverContent",
          "children": [
            {
              "type": "div",
              "children": [
                {
                  "type": "p",
                  "children": "ID: @item.id"
                },
                {
                  "type": "p",
                  "children": "Value: @item.value"
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
```

## JSONata Integration

Use JSONata library for advanced data filtering, transformation, and querying.

### Installation

```bash
npm install jsonata
```

### Usage in Actions

```typescript
import jsonata from "jsonata";

const store = {
  state: {
    products: [...],
    filteredProducts: [],
    query: "$[price < 100]"
  },
  actions: {
    applyFilter: async (state) => {
      try {
        const expression = jsonata(state.query);
        const result = await expression.evaluate(state.products);
        state.filteredProducts = Array.isArray(result) ? result : [result];
      } catch (err) {
        state.error = err.message;
      }
    }
  }
};
```

### Common JSONata Queries

```javascript
// Filter by condition
"$[price < 100]"

// Filter by category
"$[category = 'Electronics']"

// Multiple conditions
"$[category = 'Furniture' and price < 300]"

// Sort ascending
"$ ^(price)"

// Sort descending
"$ ^(>price)"

// Top N items
"$ ^(>rating)[[0..2]]"

// Group by category
"$ { category: $ }"
```

### Example Configuration

```json
{
  "type": "div",
  "children": [
    {
      "type": "ControlledInput",
      "props": {
        "value": "@store.state.query",
        "onChange": {
          "$action": "set",
          "path": "query"
        },
        "placeholder": "Enter JSONata query"
      }
    },
    {
      "type": "Button",
      "props": {
        "onClick": "@store.actions.applyFilter"
      },
      "children": "Apply Filter"
    },
    {
      "type": "Repeater",
      "props": {
        "items": "@store.state.filteredProducts",
        "template": {
          "type": "Card",
          "children": "@item.name"
        }
      }
    }
  ]
}
```

## Chart Components

Full support for Recharts library components for data visualization.

### Available Components

- **PieChart, Pie, Cell**: Pie and donut charts
- **BarChart, Bar**: Bar charts
- **LineChart, Line**: Line charts
- **XAxis, YAxis**: Chart axes
- **CartesianGrid**: Grid lines
- **ChartTooltip, ChartTooltipContent**: Tooltips

### Usage

```json
{
  "type": "ChartContainer",
  "props": {
    "config": {},
    "style": { "height": "300px" }
  },
  "children": [
    {
      "type": "PieChart",
      "children": [
        {
          "type": "Pie",
          "props": {
            "data": "@store.state.categoryData",
            "dataKey": "value",
            "nameKey": "name",
            "cx": "50%",
            "cy": "50%",
            "outerRadius": 100,
            "label": true
          }
        },
        {
          "type": "ChartTooltip",
          "props": {
            "content": "ChartTooltipContent"
          }
        }
      ]
    }
  ]
}
```

### Example with Dynamic Data

```typescript
const store = {
  state: {
    salesData: [
      { month: "Jan", sales: 186, revenue: 4200 },
      { month: "Feb", sales: 305, revenue: 6800 }
    ],
    categoryData: [
      { name: "Electronics", value: 35, fill: "#3b82f6" },
      { name: "Furniture", value: 25, fill: "#10b981" }
    ]
  }
};
```

### BarChart Example

```json
{
  "type": "BarChart",
  "props": {
    "data": "@store.state.salesData"
  },
  "children": [
    {
      "type": "CartesianGrid",
      "props": { "strokeDasharray": "3 3" }
    },
    {
      "type": "XAxis",
      "props": { "dataKey": "month" }
    },
    {
      "type": "YAxis"
    },
    {
      "type": "Bar",
      "props": {
        "dataKey": "sales",
        "fill": "#3b82f6"
      }
    }
  ]
}
```

### Using Repeater for Dynamic Colors

```json
{
  "type": "Pie",
  "props": {
    "data": "@store.state.categoryData",
    "dataKey": "value"
  },
  "children": [
    {
      "type": "Repeater",
      "props": {
        "items": "@store.state.categoryData",
        "template": {
          "type": "Cell",
          "props": {
            "fill": "@item.fill"
          }
        }
      }
    }
  ]
}
```

## Component Registration

Centralized system for registering components globally and per-page.

### Global Registration

All common components are registered automatically in `/src/lib/registerComponents.ts`:

```typescript
import { registerCommonComponents } from "./lib";

// Called automatically when importing from lib
// Registers: Button, Card, Input, Popover, Chart components, Repeater, ControlledInput, HTML elements
```

### Page-Specific Registration

Pages should only register components unique to that page:

```typescript
import { componentRegistry, pluginRegistry } from "../../lib";
import { PageSpecificComponent } from "./components/PageSpecificComponent";

// Register ONLY page-specific components
componentRegistry.register("PageSpecificComponent", PageSpecificComponent);

// Register plugins
pluginRegistry.register(somePlugin);
```

### What's Registered Globally

- **UI Components**: Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Popover, PopoverTrigger, PopoverContent, Input, ControlledInput, Checkbox
- **Chart Components**: ChartContainer, ChartTooltip, ChartTooltipContent, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
- **Library Components**: Repeater, ControlledInput
- **HTML Elements**: div, h1, h2, h3, p, span, label, pre

### Best Practices

- **DO**: Register page-specific components locally
- **DO**: Import and use `registerCommonComponents()` if creating a new entry point
- **DON'T**: Re-register common components on individual pages
- **DON'T**: Import UI components directly on pages (use componentRegistry instead)

## Dynamic Computed Properties

Computed properties can be defined as TypeScript functions OR JSONata expressions in the JSON config.

### JSONataComputed Interface

```typescript
interface JSONataComputed {
  $jsonata: string;  // JSONata expression
  source: string;    // @store.state.* reference to data source
}

type ComputedValue<State> = 
  | ((state: State) => unknown)  // Function
  | JSONataComputed;              // JSONata expression
```

### Features

- **Data Transformation**: Sort, filter, slice, and transform data using JSONata
- **Declarative**: Define complex queries in JSON without writing TypeScript
- **Reactive**: Automatically updates when source data changes
- **Memoized**: Computed values are cached and only recalculated when dependencies change
- **Mixed Mode**: Use both function and JSONata computed in the same store

### Usage

```typescript
const store: StoreConfig<State> = {
  state: {
    products: [
      { id: 1, name: "Laptop", price: 999, rating: 4.5 },
      { id: 2, name: "Mouse", price: 25, rating: 4.2 },
      { id: 3, name: "Keyboard", price: 75, rating: 4.8 }
    ]
  },
  computed: {
    // JSONata: Sort by price ascending
    sortedByPrice: {
      $jsonata: "$ ^(>price)",
      source: "@store.state.products"
    },
    // JSONata: Filter expensive items
    expensiveProducts: {
      $jsonata: "$[price > 100]",
      source: "@store.state.products"
    },
    // JSONata: Top 5 rated products
    topRated: {
      $jsonata: "$ ^(>rating)[[0..4]]",
      source: "@store.state.products"
    },
    // Function: Total count (existing style)
    totalCount: (state) => state.products.length
  }
};
```

### Common JSONata Patterns

**Sorting:**
```json
{
  "$jsonata": "$ ^(>price)",        // Sort ascending by price
  "source": "@store.state.products"
}
{
  "$jsonata": "$ ^(<price)",        // Sort descending by price
  "source": "@store.state.products"
}
```

**Filtering:**
```json
{
  "$jsonata": "$[price > 100]",     // Filter by condition
  "source": "@store.state.products"
}
{
  "$jsonata": "$[inStock = true]",  // Filter by boolean
  "source": "@store.state.products"
}
```

**Slicing:**
```json
{
  "$jsonata": "$[[0..4]]",          // First 5 items
  "source": "@store.state.products"
}
{
  "$jsonata": "$ ^(>rating)[[0..2]]", // Top 3 rated
  "source": "@store.state.products"
}
```

**Combining:**
```json
{
  "$jsonata": "$[price < 100] ^(>rating)[[0..9]]", // Filter, sort, slice
  "source": "@store.state.products"
}
```

### Source Paths

The `source` field supports:
- Root state: `"@store.state"`
- Nested paths: `"@store.state.user.orders"`
- Array properties: `"@store.state.products"`

### Error Handling

Invalid JSONata expressions log errors to console and return `null`:

```typescript
// Invalid expression
{
  "$jsonata": "$ ^(>invalid syntax",
  "source": "@store.state.products"
}
// Console: "JSONata error in computed.sortedProducts: ..."
// Returns: null
```

### When to Use

**Use JSONata computed when:**
- Sorting, filtering, or slicing arrays
- Simple data transformations
- Query-like operations
- Configuration should be portable/serializable

**Use function computed when:**
- Complex business logic
- Multiple data sources
- Conditional logic with many branches
- Need TypeScript type safety

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
