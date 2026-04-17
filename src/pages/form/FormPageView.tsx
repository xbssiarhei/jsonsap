import { useState } from "react";
import { JsonRenderer } from "../../lib";
import { formPageConfig } from "./FormPage";
import { ConfigEditor } from "../../components/ConfigEditor";

export function FormPageView() {
  const [config, setConfig] = useState(formPageConfig);

  return (
    <div>
      <div style={{ position: "fixed", top: "80px", right: "24px", zIndex: 1000 }}>
        <ConfigEditor config={config} onConfigChange={setConfig} />
      </div>
      <JsonRenderer config={config} />
    </div>
  );
}
