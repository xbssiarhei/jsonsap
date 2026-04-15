# JSON-Driven Web App Builder (jsonsap)

A React library that renders applications from JSON configuration with extensible component mapping and plugin system.

## Features

- **JSON Configuration**: Define your entire UI structure using JSON
- **Component Registry**: Extensible mapping of component names to React components
- **Plugin System**: Hook into the rendering lifecycle with `beforeRender` and `afterRender` plugins
- **Type-Safe**: Full TypeScript support

## Installation

```bash
npm install
npm run dev
```

## Quick Start

```typescript
import { JsonRenderer, componentRegistry, pluginRegistry } from './lib';
import { Button } from './components/ui/button';

// 1. Register components
componentRegistry.register('Button', Button);
componentRegistry.register('div', 'div');

// 2. Create JSON configuration
const config = {
  type: 'div',
  children: [
    {
      type: 'Button',
      props: {
        variant: 'default',
        onClick: () => alert('Clicked!')
      },
      children: 'Click me'
    }
  ]
};

// 3. Render
function App() {
  return <JsonRenderer config={config} />;
}
```

## JSON Configuration Format

```typescript
interface ComponentConfig {
  type: string;                    // Component name from registry
  props?: Record<string, any>;     // Component props
  children?: ComponentConfig[] | ComponentConfig | string | number;
  plugins?: string[];              // Plugin names to apply
}
```

### Example

```json
{
  "type": "Button",
  "props": {
    "variant": "default",
    "onClick": "handleClick"
  },
  "plugins": ["logger"],
  "children": "Click me"
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
