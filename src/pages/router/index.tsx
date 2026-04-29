import { RouterRenderer } from "@/lib/router";
import { config } from "./config";

export default function RouterPageView() {
  return <RouterRenderer config={config} />;
}
