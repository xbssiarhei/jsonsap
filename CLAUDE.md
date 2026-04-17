# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite application using Tailwind CSS v4 and shadcn/ui components. The project name is "jsonsap".

### Core Concept

The application is a JSON-driven web app builder that renders UI from configuration. Key features:

- **JSON Configuration**: Accepts JSON config that defines the entire application structure
- **Component Mapping**: Takes a mapping of component "building blocks" (кирпичи) that can be extended
- **Plugin System**: Supports plugins that hook into runtime processes
  - Plugins can intercept and modify components before rendering
  - Specified in configuration to execute at specific lifecycle points
  - Enable runtime modifications and transformations
  - AutoBind plugin for automatic form input binding
- **Modifiers System**: Conditional prop modifications based on data thresholds
  - Apply styles, classes, or props when conditions are met
  - Supports multiple operators and data sources
  - Enables dynamic styling without custom components
  - Supports @store.\* references in condition values for dynamic thresholds
- **Live Config Editor**: Built-in UI for editing JSON configuration on the fly
  - Dialog-based editor with syntax validation
  - Real-time preview of changes
  - Available on demo and stress test pages
- **Event Handlers**: Full support for onClick, onChange in Repeater
  - Automatically passes item data to actions
  - Works with both onClick and onChange handlers

### Configuration Architecture

The JSON configuration is separated into two main sections:

#### 1. UI Configuration (`ui`)

Defines the visual structure and component tree:

- Component hierarchy and nesting
- Component types and props
- Layout and styling
- Event handlers (references to store actions)
- Plugin assignments per component

#### 2. Store Configuration (`store`)

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
- State management flexibility (can swap store implementations)
- Better code organization for large applications

**Example Structure:**

```json
{
  "store": {
    "state": {
      "count": 0,
      "user": null
    },
    "actions": {
      "increment": "count++",
      "setUser": "user = payload"
    }
  },
  "ui": {
    "type": "div",
    "children": [
      {
        "type": "Button",
        "props": {
          "onClick": "@store.actions.increment"
        },
        "children": "@store.state.count"
      }
    ]
  }
}
```

## Development Commands

- `npm run dev` - Start development server with HMR
- `npm run build` - Type check with TypeScript and build for production
- `npm run lint` - Run ESLint on all files
- `npm run preview` - Preview production build locally

## Tech Stack

- **Framework**: React 19.2.4
- **Build Tool**: Vite 8.0.4 with @vitejs/plugin-react
- **Language**: TypeScript 6.0.2
- **Styling**: Tailwind CSS 4.2.2 with @tailwindcss/vite plugin
- **UI Components**: shadcn/ui pattern with Radix UI primitives
- **Fonts**: Geist Variable (@fontsource-variable/geist)
- **Icons**: Lucide React

## Project Structure

- `src/components/ui/` - Reusable UI components following shadcn/ui patterns
- `src/lib/utils.ts` - Utility functions, including `cn()` for class merging
- `src/assets/` - Static assets (images, SVGs)
- Path alias `@/*` maps to `./src/*`

## Code Patterns

### Configuration Structure

The library uses a two-part configuration model:

**UI Section:**

- Defines component tree structure
- Component types, props, and children
- References to store state and actions using `@store.*` syntax
- Plugin assignments
- Supports both direct references and string interpolation
- Modifiers for conditional prop modifications based on thresholds

**Store Section:**

- Application state definitions
- Action/mutation handlers (as functions, not JSON strings)
- Computed properties (derived values)
- Uses Valtio for reactive state management
- Uses derive-valtio for computed properties

**@store.\* Syntax:**

- `@store.state.*` - Access reactive state values
- `@store.actions.*` - Reference action functions
- `@store.computed.*` - Access computed properties
- Direct reference: `"children": "@store.state.count"` returns the value
- String interpolation: `"children": "Count: @store.state.count"` embeds value in text
- Multiple references: `"Count: @store.state.count, User: @store.state.user.name"`

**Modifiers System:**

- Conditional prop modifications based on data values
- Supports operators: `equals`, `notEquals`, `greaterThan`, `lessThan`, `contains`
- Can reference props (`item.status`), nested paths, or store values (`@store.state.theme`)
- **Store references in condition values**: Use `@store.state.*` for dynamic thresholds
- Multiple conditions with AND/OR logic via `matchAll` parameter
- Automatically merges styles and concatenates classNames
- Example:

```json
{
  "type": "Card",
  "props": { "item": "@item" },
  "modifiers": [
    {
      "conditions": [
        { "path": "item.status", "operator": "equals", "value": "active" },
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

**Repeater Component:**

- Universal component for rendering arrays from JSON config
- Uses `@item.*` syntax to reference array item properties
- Supports nested paths: `@item.user.name`
- String interpolation: `"Item #@item.id: @item.name"`
- Special handling for `item: "@item"` to pass entire item object
- **Full event handler support**: onClick and onChange with automatic item data passing
- Example with onClick:

```json
{
  "type": "Card",
  "props": {
    "onClick": "@store.actions.selectItem",
    "item": "@item.id"
  }
}
```

- Example with onChange:

```json
{
  "type": "Input",
  "props": {
    "value": "@item.value",
    "onChange": "@store.actions.updateItem",
    "item": "@item.id"
  }
}
```

**AutoBind Plugin:**

- Automatically creates onChange handlers for form inputs
- Use `autoBind: "path.to.state"` prop to specify store state path
- Supports nested paths: `autoBind: "user.email"`
- Handles checkbox inputs automatically (uses `checked` instead of `value`)
- Example:

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

### Component Styling

- Uses `class-variance-authority` (cva) for variant-based component styling
- `cn()` utility (clsx + tailwind-merge) for conditional class merging
- Tailwind CSS v4 with modern features

### UI Components

- shadcn/ui pattern: components in `src/components/ui/`
- Radix UI primitives for accessible base components
- Components support `asChild` prop pattern for composition

## TypeScript Configuration

- Strict mode enabled
- Path aliases configured: `@/*` → `./src/*`
- Project uses TypeScript project references (tsconfig.app.json, tsconfig.node.json)

## ESLint Configuration

- Flat config format (eslint.config.js)
- TypeScript ESLint with recommended rules
- React Hooks plugin with recommended rules
- React Refresh plugin for Vite
- Ignores `dist/` directory
