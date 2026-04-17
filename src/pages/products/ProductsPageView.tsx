import { useState } from "react";
import { JsonRenderer } from "../../lib/renderer";
import { productsPageConfig } from "./ProductsPage";
import { ConfigEditor } from "../../components/ConfigEditor";

export default function ProductsPageView() {
  const [config, setConfig] = useState(productsPageConfig);

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
