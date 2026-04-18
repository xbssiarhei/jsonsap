import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { DemoPageView } from "./pages/demo/DemoPageView";
import { StressTestPageView } from "./pages/stress-test/StressTestPageView";
import { MapPageView } from "./pages/map/MapPageView";
import { ApiPageView } from "./pages/api/ApiPageView";
import { FormPageView } from "./pages/form/FormPageView";
import { DashboardPageView } from "./pages/dashboard/DashboardPageView";
import { JsonataPageView } from "./pages/jsonata/JsonataPageView";
import { ProductsPageView } from "./pages/products/ProductsPageView";
import ValtioTestPageView from "./pages/valtio-test/ValtioTestPageView";
import HomePage from "./pages/home/";
import Layout from "./Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="demo" element={<DemoPageView />} />
          <Route path="stress-test" element={<StressTestPageView />} />
          <Route path="map" element={<MapPageView />} />
          <Route path="api" element={<ApiPageView />} />
          <Route path="form" element={<FormPageView />} />
          <Route path="dashboard" element={<DashboardPageView />} />
          <Route path="jsonata" element={<JsonataPageView />} />
          <Route path="products" element={<ProductsPageView />} />
          <Route path="valtio-test" element={<ValtioTestPageView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
