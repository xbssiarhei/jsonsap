import { useState } from "react";
import { JsonRenderer } from "../../lib";
import { demoPageConfig } from "./DemoPage";
import { ConfigEditor } from "../../components/ConfigEditor";

export function DemoPageView() {
  const [config, setConfig] = useState(demoPageConfig);

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
