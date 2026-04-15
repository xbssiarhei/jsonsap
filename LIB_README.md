# JSON-Driven Web App Builder (jsonsap)

A React library that renders applications from JSON configuration with extensible component mapping and plugin system.

## Features

- **JSON Configuration**: Define your entire UI structure using JSON with separated UI and Store sections
- **Component Registry**: Extensible mapping of component names to React components
- **Plugin System**: Hook into the rendering lifecycle with `beforeRender` and `afterRender` plugins
- **State Management**: Built-in store configuration for application state and actions
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

## JSON Configuration Format

### Full Configuration Structure

```typescript
interface AppConfig {
  store?: {
    state?: Record<string, unknown>;
    actions?: Record<string, string | Function>;
    computed?: Record<string, string | Function>;
  };
  ui: ComponentConfig;
}

interface ComponentConfig {
  type: string;                    // Component name from registry
  props?: Record<string, unknown>; // Component props
  children?: ComponentConfig[] | ComponentConfig | string | number;
  plugins?: string[];              // Plugin names to apply
}
```

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

```json
{
  "store": {
    "state": {
      "count": 0,
      "user": null,
      "isLoading": false
    },
    "actions": {
      "increment": "count++",
      "decrement": "count--",
      "setUser": "user = payload",
      "toggleLoading": "isLoading = !isLoading"
    },
    "computed": {
      "doubleCount": "count * 2",
      "userName": "user?.name || 'Guest'"
    }
  }
}
```

## Component Registry

Register components to make them available in JSON configs:

```typescript
import { componentRegistry } from './lib';
import { Button } from './components/ui/button';

// Register custom component
componentRegistry.register('Button', Button);

// Register HTML elements
componentRegistry.register('div', 'div');
componentRegistry.register('span', 'span');

// Check if component exists
if (componentRegistry.has('Button')) {
  // ...
}

// Unregister component
componentRegistry.unregister('Button');
```

## Plugin System

Plugins can modify components before or after rendering.

### Plugin Interface

```typescript
interface Plugin {
  name: string;
  beforeRender?: (config: ComponentConfig, context: PluginContext) => ComponentConfig;
  afterRender?: (element: ReactElement, config: ComponentConfig, context: PluginContext) => ReactElement;
}
```

### Creating a Plugin

```typescript
import { Plugin } from './lib';

const loggerPlugin: Plugin = {
  name: 'logger',
  beforeRender: (config, context) => {
    console.log('Rendering:', config.type);
    return config;
  }
};

// Register plugin
pluginRegistry.register(loggerPlugin);
```

### Using Plugins

```typescript
const config = {
  type: 'Button',
  plugins: ['logger', 'wrapper'],  // Apply multiple plugins
  children: 'Click me'
};
```

### Built-in Example Plugins

#### Logger Plugin
Logs component rendering to console:

```typescript
import { loggerPlugin } from './lib/plugins/logger';
pluginRegistry.register(loggerPlugin);
```

#### Wrapper Plugin
Wraps components in a styled div:

```typescript
import { wrapperPlugin } from './lib/plugins/wrapper';
pluginRegistry.register(wrapperPlugin);
```

## Advanced Usage

### Connecting UI to Store

Use `@store.*` syntax to reference store values in UI configuration:

```json
{
  "store": {
    "state": {
      "count": 0
    },
    "actions": {
      "increment": "count++"
    }
  },
  "ui": {
    "type": "div",
    "children": [
      {
        "type": "p",
        "children": "@store.state.count"
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
    type: 'div',
    children: [
      {
        type: 'h1',
        children: 'Title'
      },
      {
        type: 'Button',
        props: { variant: 'default' },
        children: 'Action'
      }
    ]
  }
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
  name: 'theme',
  beforeRender: (config, context) => {
    if (context.theme === 'dark') {
      config.props = {
        ...config.props,
        className: 'dark-mode'
      };
    }
    return config;
  }
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

The library is designed to support:
- Full store implementation with state management
- `@store.*` syntax resolver for connecting UI to state
- Computed properties and reactive updates
- Async action handlers
- State persistence and hydration
- Developer tools for debugging

## License

MIT

## Component Registry

Register components to make them available in JSON configs:

```typescript
import { componentRegistry } from './lib';
import { Button } from './components/ui/button';

// Register custom component
componentRegistry.register('Button', Button);

// Register HTML elements
componentRegistry.register('div', 'div');
componentRegistry.register('span', 'span');

// Check if component exists
if (componentRegistry.has('Button')) {
  // ...
}

// Unregister component
componentRegistry.unregister('Button');
```

## Plugin System

Plugins can modify components before or after rendering.

### Plugin Interface

```typescript
interface Plugin {
  name: string;
  beforeRender?: (config: ComponentConfig, context: PluginContext) => ComponentConfig;
  afterRender?: (element: ReactElement, config: ComponentConfig, context: PluginContext) => ReactElement;
}
```

### Creating a Plugin

```typescript
import { Plugin } from './lib';

const loggerPlugin: Plugin = {
  name: 'logger',
  beforeRender: (config, context) => {
    console.log('Rendering:', config.type);
    return config;
  }
};

// Register plugin
pluginRegistry.register(loggerPlugin);
```

### Using Plugins

```typescript
const config = {
  type: 'Button',
  plugins: ['logger', 'wrapper'],  // Apply multiple plugins
  children: 'Click me'
};
```

### Built-in Example Plugins

#### Logger Plugin
Logs component rendering to console:

```typescript
import { loggerPlugin } from './lib/plugins/logger';
pluginRegistry.register(loggerPlugin);
```

#### Wrapper Plugin
Wraps components in a styled div:

```typescript
import { wrapperPlugin } from './lib/plugins/wrapper';
pluginRegistry.register(wrapperPlugin);
```

## Advanced Usage

### Nested Components

```typescript
const config = {
  type: 'div',
  children: [
    {
      type: 'h1',
      children: 'Title'
    },
    {
      type: 'Button',
      props: { variant: 'default' },
      children: 'Action'
    }
  ]
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
  name: 'theme',
  beforeRender: (config, context) => {
    if (context.theme === 'dark') {
      config.props = {
        ...config.props,
        className: 'dark-mode'
      };
    }
    return config;
  }
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
