import { useState } from "react";
import "./App.css";
import {
  JsonRenderer,
  componentRegistry,
  pluginRegistry,
  type ComponentConfig,
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

// JSON configuration for the app
const appConfig: ComponentConfig = {
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
      children: "JSON-Driven Web App Builder",
    },
    {
      type: "p",
      props: {
        style: { marginBottom: "30px", color: "#666" },
      },
      children:
        "This entire UI is rendered from JSON configuration with plugin support",
    },
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          gap: "10px",
          marginBottom: "30px",
          flexWrap: "wrap",
        },
      },
      children: [
        {
          type: "Button",
          props: {
            variant: "default",
            onClick: () => alert("Default button clicked!"),
          },
          plugins: ["logger"],
          children: "Default Button",
        },
        {
          type: "Button",
          props: {
            variant: "outline",
            onClick: () => alert("Outline button clicked!"),
          },
          plugins: ["logger"],
          children: "Outline Button",
        },
        {
          type: "Button",
          props: {
            variant: "secondary",
            onClick: () => alert("Secondary button clicked!"),
          },
          plugins: ["logger", "wrapper"],
          children: "With Wrapper Plugin",
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
          children: "✓ JSON-based component configuration",
        },
        {
          type: "p",
          children: "✓ Extensible component registry",
        },
        {
          type: "p",
          children: "✓ Plugin system with beforeRender and afterRender hooks",
        },
        {
          type: "p",
          children: "✓ Nested component support",
        },
      ],
    },
  ],
};

function App() {
  const [count, setCount] = useState(0);

  // Dynamic config with state
  const dynamicConfig: ComponentConfig = {
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
        children: "Dynamic State Example",
      },
      {
        type: "p",
        props: {
          style: { marginBottom: "10px" },
        },
        children: `Count: ${count}`,
      },
      {
        type: "Button",
        props: {
          variant: "default",
          onClick: () => setCount(count + 1),
        },
        plugins: ["logger"],
        children: "Increment",
      },
    ],
  };

  return (
    <>
      <JsonRenderer config={appConfig} />
      <JsonRenderer config={dynamicConfig} />
    </>
  );
}

export default App;
