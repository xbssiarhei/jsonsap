import { Link, Outlet, useLocation } from "react-router";
import { Button } from "./components/ui/button";

const menuItems = [
  { path: "/", label: "Home" },
  { path: "/demo", label: "Demo" },
  { path: "/stress-test", label: "Stress Test" },
  { path: "/map", label: "Map" },
  { path: "/api", label: "API" },
  { path: "/form", label: "Form" },
  { path: "/dashboard", label: "Dashboard" },
  { path: "/jsonata", label: "JSONata" },
  { path: "/products", label: "Products" },
];

const Layout = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="px-6 py-4 border-b bg-background overflow-x-auto sticky top-0">
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
              {menuItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button variant={isActive(item.path) ? "outline" : "ghost"}>
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <a href="#" rel="noopener noreferrer">
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
    </>
  );
};

export default Layout;
