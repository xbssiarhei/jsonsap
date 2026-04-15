import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { DemoPageView } from "./pages/demo/DemoPageView";
import HomePage from "./pages/home";
import Layout from "./Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="demo" element={<DemoPageView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
