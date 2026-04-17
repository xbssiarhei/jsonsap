import { useState } from "react";
import { JsonRenderer } from "../../lib/renderer";
import { productsPageConfig } from "./ProductsPage";
import { ConfigEditor } from "../../components/ConfigEditor";

export default function ProductsPageView() {
  const [config, setConfig] = useState(productsPageConfig);

  return (
    <div>
      <ConfigEditor config={config} onConfigChange={setConfig} />
      <JsonRenderer config={config} />
    </div>
  );
}
