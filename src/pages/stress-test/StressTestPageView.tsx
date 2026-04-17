import { useState } from "react";
import { JsonRenderer } from "../../lib";
import { stressTestPageConfig } from "./StressTestPage";
import { ConfigEditor } from "../../components/ConfigEditor";

export function StressTestPageView() {
  const [config, setConfig] = useState(stressTestPageConfig);

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
