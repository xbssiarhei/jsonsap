import { RouterRenderer } from "@/lib/router";
import { config } from "./config";
import { JsxToConfigDialog } from "@/lib/tools";

import "./components";
// pnpm dlx shadcn add @shadcnblocks/chart-group15
// https://blocks.so/sidebar

export default function RouterPageView() {
  return (
    <div className="relative h-full">
      <div className="absolute top-3 right-3 z-50">
        <JsxToConfigDialog />
      </div>
      <RouterRenderer config={config} />
    </div>
  );
}
