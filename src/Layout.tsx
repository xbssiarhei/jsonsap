import { Link, Outlet } from "react-router";

const Layout = () => {
  return (
    <div>
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid #ddd",
          marginBottom: "20px",
        }}
      >
        <nav
          style={{
            display: "flex",
            gap: "20px",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "#3b82f6",
              fontWeight: "500",
            }}
          >
            Home
          </Link>
          <Link
            to="/demo"
            style={{
              textDecoration: "none",
              color: "#3b82f6",
              fontWeight: "500",
            }}
          >
            Demo
          </Link>
        </nav>
      </div>
      <Outlet />
    </div>
  );
};

export default Layout;
