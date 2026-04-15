import { Link, Outlet } from "react-router";
import { Button } from "./components/ui/button";

const Layout = () => {
  return (
    <div>
      <header className="px-6 py-4 border-b bg-background">
        <nav className="flex items-center justify-between mx-auto max-w-[1200px]">
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <Link
              to="/"
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                textDecoration: "none",
                color: "#000",
              }}
            >
              jsonsap
            </Link>
            <div className="flex gap-4">
              <Link to="/">
                <Button variant="ghost">Home</Button>
              </Link>
              <Link to="/demo">
                <Button variant="ghost">Demo</Button>
              </Link>
              <Link to="/stress-test">
                <Button variant="ghost">Stress Test</Button>
              </Link>
              <Link to="/map">
                <Button variant="ghost">Map</Button>
              </Link>
            </div>
          </div>
          <div className="flex gap-4">
            <a
              href="https://github.com/anthropics/claude-code"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                GitHub
              </Button>
            </a>
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
