import { Link } from "react-router";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";

export default function HomePage() {
  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "40px", textAlign: "center" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "16px" }}>
          Welcome to jsonsap
        </h1>
        <p style={{ fontSize: "20px", color: "#666", marginBottom: "32px" }}>
          A JSON-driven web app builder with reactive state management
        </p>
        <Link to="/demo">
          <Button size="lg">View Demo</Button>
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginTop: "48px" }}>
        <Card>
          <CardHeader>
            <CardTitle>JSON Configuration</CardTitle>
            <CardDescription>Define your entire UI using JSON</CardDescription>
          </CardHeader>
          <CardContent>
            <p style={{ color: "#666" }}>
              Build applications by writing JSON configurations instead of code.
              Separate UI structure from logic for better maintainability.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reactive State</CardTitle>
            <CardDescription>Valtio-powered state management</CardDescription>
          </CardHeader>
          <CardContent>
            <p style={{ color: "#666" }}>
              Automatic reactivity with Valtio. Components re-render only when
              their dependencies change. No manual subscriptions needed.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plugin System</CardTitle>
            <CardDescription>Extend functionality with plugins</CardDescription>
          </CardHeader>
          <CardContent>
            <p style={{ color: "#666" }}>
              Hook into the rendering lifecycle with beforeRender and afterRender
              plugins. Modify components on the fly.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Component Registry</CardTitle>
            <CardDescription>Extensible component mapping</CardDescription>
          </CardHeader>
          <CardContent>
            <p style={{ color: "#666" }}>
              Register your own components or use built-in ones.
              Easy to extend with custom building blocks.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>@store.* Syntax</CardTitle>
            <CardDescription>Connect UI to state seamlessly</CardDescription>
          </CardHeader>
          <CardContent>
            <p style={{ color: "#666" }}>
              Reference state, actions, and computed values directly in JSON
              using @store.* syntax. Supports string interpolation.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Modifiers System</CardTitle>
            <CardDescription>Conditional styling with thresholds</CardDescription>
          </CardHeader>
          <CardContent>
            <p style={{ color: "#666" }}>
              Apply styles and props conditionally based on data values.
              Supports operators like equals, greaterThan, contains.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Repeater Component</CardTitle>
            <CardDescription>Universal array rendering</CardDescription>
          </CardHeader>
          <CardContent>
            <p style={{ color: "#666" }}>
              Render arrays from JSON without hardcoded components.
              Use @item.* syntax to reference array item properties.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live Config Editor</CardTitle>
            <CardDescription>Edit JSON on the fly</CardDescription>
          </CardHeader>
          <CardContent>
            <p style={{ color: "#666" }}>
              Built-in dialog editor for modifying UI configuration at runtime.
              Real-time validation and instant preview of changes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>TypeScript Support</CardTitle>
            <CardDescription>Fully typed for better DX</CardDescription>
          </CardHeader>
          <CardContent>
            <p style={{ color: "#666" }}>
              Complete TypeScript support with type inference.
              Catch errors early and enjoy better IDE autocomplete.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
