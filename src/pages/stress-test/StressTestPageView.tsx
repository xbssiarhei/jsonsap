import { JsonRenderer } from "../../lib";
import { stressTestPageConfig } from "./StressTestPage";

export function StressTestPageView() {
  return <JsonRenderer config={stressTestPageConfig} />;
}
