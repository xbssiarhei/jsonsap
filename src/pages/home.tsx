import { Link } from "react-router";

export default function HomePage() {
  return (
    <div
      style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}
      className="max-w-6xl"
    >
      <h1 style={{ marginBottom: "20px" }}>Welcome to jsonsap</h1>
      <p style={{ marginBottom: "20px", color: "#666" }}>
        A JSON-driven web app builder with reactive state management
      </p>
      <div style={{ display: "flex", gap: "10px" }}>
        <Link
          to="/demo"
          style={{
            padding: "10px 20px",
            backgroundColor: "#3b82f6",
            color: "white",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "500",
          }}
        >
          View Demo
        </Link>
      </div>
    </div>
  );
}
