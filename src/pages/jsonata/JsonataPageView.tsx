import { ConfigEditor } from "@/components/ConfigEditor";
import { JsonRenderer } from "../../lib";
import { jsonataPageConfig } from "./JsonataPage";
import { useState } from "react";

export default function JsonataPageView() {
  const [config, setConfig] = useState(jsonataPageConfig);
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
