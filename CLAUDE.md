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
