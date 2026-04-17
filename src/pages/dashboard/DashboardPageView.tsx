import { ConfigEditor } from "@/components/ConfigEditor";
import { JsonRenderer } from "../../lib";
import { dashboardPageConfig } from "./DashboardPage";
import { useState } from "react";

export default function DashboardPageView() {
  const [config, setConfig] = useState(dashboardPageConfig);
  return (
    <div>
      <div
        style={{ position: "fixed", top: "80px", right: "24px", zIndex: 1000 }}
      >
        <ConfigEditor config={config} onConfigChange={setConfig} />
      </div>
      <JsonRenderer config={config} />
    </div>
  );
}
