import { useState } from "react";
import { JsonRenderer } from "../../lib";
import { apiPageConfig } from "./ApiPage";
import { ConfigEditor } from "../../components/ConfigEditor";
import type { AppConfig } from "../../lib/types";

export function ApiPageView() {
  const [config, setConfig] = useState<AppConfig>(apiPageConfig);

  return (
    <div>
      <div style={{ position: "fixed", top: "80px", right: "24px", zIndex: 1000 }}>
        <ConfigEditor config={config} onConfigChange={setConfig} />
      </div>
      <JsonRenderer config={config} />
    </div>
  );
}
