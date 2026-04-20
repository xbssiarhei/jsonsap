import { JsonRenderer } from "@/lib";
import config from "./DashboardPage";

export default function DashboardPageView() {
  return <JsonRenderer.Root config={config} />;
}
