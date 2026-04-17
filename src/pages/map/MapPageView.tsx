import { useState } from "react";
import { JsonRenderer } from "../../lib";
import { mapPageConfig } from "./MapPage";
import { ConfigEditor } from "../../components/ConfigEditor";

export function MapPageView() {
  const [config, setConfig] = useState(mapPageConfig);

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
