import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { DemoPageView } from "./pages/demo/DemoPageView";
import { StressTestPageView } from "./pages/stress-test/StressTestPageView";
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
