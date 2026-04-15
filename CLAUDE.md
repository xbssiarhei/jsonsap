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

**Store Section:**
- Application state definitions
- Action/mutation handlers
- Computed properties
- Async operations and side effects

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
