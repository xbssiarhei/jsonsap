import { JsonRenderer } from "../../lib";
import { demoPageConfig } from "./DemoPage";

export function DemoPageView() {
  return <JsonRenderer config={demoPageConfig} />;
}
