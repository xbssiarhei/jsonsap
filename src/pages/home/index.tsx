import { Link } from "react-router";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const features = [
  {
    title: "JSON Configuration",
    description: "Define your entire UI using JSON",
    content:
      "Build applications by writing JSON configurations instead of code. Separate UI structure from logic for better maintainability.",
  },
  {
    title: "Reactive State",
    description: "Valtio-powered state management",
    content:
      "Automatic reactivity with Valtio. Components re-render only when their dependencies change. No manual subscriptions needed.",
  },
  {
    title: "Plugin System",
    description: "Extend functionality with plugins",
    content:
      "Hook into the rendering lifecycle with beforeRender and afterRender plugins. Modify components on the fly.",
  },
  {
    title: "Component Registry",
    description: "Extensible component mapping",
    content:
      "Register your own components or use built-in ones. Easy to extend with custom building blocks.",
  },
  {
    title: "@store.* Syntax",
    description: "Connect UI to state seamlessly",
    content:
      "Reference state, actions, and computed values directly in JSON using @store.* syntax. Supports string interpolation.",
  },
  {
    title: "Modifiers System",
    description: "Dynamic styling with conditions",
    content:
      "Apply styles and props conditionally based on data values. Supports operators and store references for dynamic thresholds.",
  },
  {
    title: "Repeater Component",
    description: "Universal array rendering",
    content:
      "Render arrays from JSON without hardcoded components. Use @item.* syntax with full event handler support.",
  },
  {
    title: "AutoBind Plugin",
    description: "Automatic form binding",
    content:
      "Automatically bind form inputs to store state. No manual onChange handlers needed.",
  },
  {
    title: "Live Config Editor",
    description: "Edit JSON on the fly",
    content:
      "Built-in dialog editor for modifying UI configuration at runtime. Real-time validation and instant preview of changes.",
  },
  {
    title: "API Integration",
    description: "Async actions and data fetching",
    content:
      "Support for async actions in store. Fetch data from APIs and manage loading states directly in JSON config.",
  },
  {
    title: "Event Handlers",
    description: "onClick, onChange with item data",
    content:
      "Full support for event handlers in Repeater. Automatically passes item data to actions.",
  },
  {
    title: "SetAction Syntax",
    description: "Declarative state updates",
    content:
      "Update store state declaratively with SetAction objects. Supports action chaining and works seamlessly with Repeater items.",
  },
  {
    title: "ControlledInput",
    description: "Cursor-stable text inputs",
    content:
      "Specialized input component that prevents cursor jumping when editing. Essential for inputs bound to reactive state.",
  },
  {
    title: "Popover Component",
    description: "Contextual overlays",
    content:
      "Display additional information in floating panels. Works with Repeater for item-specific popovers.",
  },
  {
    title: "JSONata Integration",
    description: "Powerful data filtering",
    content:
      "Query and transform data using JSONata expressions. Filter, sort, and aggregate arrays with simple query syntax.",
  },
  {
    title: "Chart Components",
    description: "Data visualization",
    content:
      "Built-in support for PieChart, BarChart, and LineChart. Bind chart data directly to store state for dynamic visualizations.",
  },
  {
    title: "Dynamic Computed",
    description: "JSONata-powered transformations",
    content:
      "Define computed properties using JSONata expressions in JSON config. Sort, filter, and transform data without writing code.",
  },
  {
    title: "Shared Library",
    description: "Reusable modifiers and resources",
    content:
      "Define modifiers once in shared section and reference them throughout your config. Eliminates code duplication and improves maintainability.",
  },
  {
    title: "Monaco Editor",
    description: "Professional code editing",
    content:
      "Integrated Monaco Editor with syntax highlighting, auto-completion, and validation. Edit JSON configurations with a powerful IDE-like experience.",
  },
  {
    title: "TypeScript Support",
    description: "Fully typed for better DX",
    content:
      "Complete TypeScript support with type inference. Catch errors early and enjoy better IDE autocomplete.",
  },
];

export default function HomePage() {
  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "40px", textAlign: "center" }}>
        <h1
          style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "16px" }}
        >
          Welcome to jsonsap
        </h1>
        <p style={{ fontSize: "20px", color: "#666", marginBottom: "32px" }}>
          A JSON-driven web app builder with reactive state management
        </p>
        <Link to="/demo">
          <Button size="lg">View Demo</Button>
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
          marginTop: "48px",
        }}
      >
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
