import { Link, Outlet, useLocation } from "react-router";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavigationMenuDemo } from "./NavMenu";

const apps = [
  { path: "/stress-test", label: "Stress Test" },
  { path: "/kanban", label: "Kanban" },
  { path: "/map", label: "Map" },
  { path: "/api", label: "API" },
  { path: "/form", label: "Form" },
  { path: "/dashboard", label: "Dashboard" },
  { path: "/jsonata", label: "JSONata" },
  { path: "/products", label: "Products" },
  { path: "/pagination", label: "Pagination" },
  { path: "/valtio-test", label: "Valtio Test" },
  { path: "/store", label: "Store" },
  { path: "/web", label: "Web" },
  { path: "/router", label: "Router" },
];

const menuItems = [
  { path: "/", label: "Home" },
  { path: "/demo", label: "Demo" },
];

const navMenuItems = [
  {
    id: "common",
    label: "Getting started",
    list: [
      {
        title: "Demo page",
        href: "/demo",
        description: "A simple demonstration of the capabilities",
      },
    ],
  },
  {
    id: "apps",
    label: "Apps",
    list: apps.map((app) => ({
      title: app.label,
      href: app.path,
      description: "A simple demonstration of the capabilities",
    })),
  },
];

const mobileMenuItems = menuItems.concat(apps);

export const Layout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="px-4 md:px-6 py-4 border-b bg-background sticky top-0 z-50">
        <nav className="flex gap-4 items-center justify-between mx-auto max-w-[1200px]">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="text-xl font-bold no-underline text-black"
          >
            jsonsap
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2 w-full justify-between">
            {/* <div className="flex gap-2">
              {menuItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "outline" : "ghost"}
                    size="sm"
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div> */}
            <NavigationMenuDemo items={navMenuItems} className="flex gap-2" />
            <a href="#" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                GitHub
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col gap-2">
              {mobileMenuItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={closeMobileMenu}>
                  <Button
                    variant={isActive(item.path) ? "outline" : "ghost"}
                    className="w-full justify-start"
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
              <a
                href="#"
                rel="noopener noreferrer"
                onClick={closeMobileMenu}
                className="mt-2"
              >
                <Button variant="outline" className="w-full">
                  GitHub
                </Button>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* <NavigationMenuDemo items={navMenuItems} className="m-2 flex gap-2" /> */}
      <main className="overflow-auto flex-1">
        <Outlet />
      </main>
    </>
  );
};
