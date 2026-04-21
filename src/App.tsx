import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { DemoPageView } from "./pages/demo/DemoPageView";
import { StressTestPageView } from "./pages/stress-test/StressTestPageView";
import { KanbanPageView } from "./pages/kanban/KanbanPageView";
import { MapPageView } from "./pages/map/MapPageView";
import { ApiPageView } from "./pages/api/ApiPageView";
import { FormPageView } from "./pages/form/FormPageView";
import DashboardPageView from "./pages/dashboard";
import { JsonataPageView } from "./pages/jsonata/JsonataPageView";
import { ProductsPageView } from "./pages/products/ProductsPageView";
import ValtioTestPageView from "./pages/valtio-test/ValtioTestPageView";
import StorePageView from "./pages/store";
import PaginationPageView from "./pages/pagination";
import HomePage from "./pages/home/";
import Layout from "./Layout";

function App() {
  const pathname = window.location.pathname;
  const basename =
    pathname && !import.meta.env.DEV
      ? pathname.endsWith("/")
        ? pathname.slice(0, -1)
        : pathname
      : "/";
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="demo" element={<DemoPageView />} />
          <Route path="stress-test" element={<StressTestPageView />} />
          <Route path="kanban" element={<KanbanPageView />} />
          <Route path="map" element={<MapPageView />} />
          <Route path="api" element={<ApiPageView />} />
          <Route path="form" element={<FormPageView />} />
          <Route path="dashboard" element={<DashboardPageView />} />
          <Route path="store" element={<StorePageView />} />
          <Route path="pagination" element={<PaginationPageView />} />
          <Route path="jsonata" element={<JsonataPageView />} />
          <Route path="products" element={<ProductsPageView />} />
          <Route path="valtio-test" element={<ValtioTestPageView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
