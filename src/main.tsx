import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
// import legacy monaco editor worker
// import "./components/Editor/useWorker.ts";

createRoot(document.getElementById("root")!).render(<App />);
