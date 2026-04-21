import { JsonRenderer } from "@/lib";
import config from "./TestPage";

export default function TestPageView() {
  return (
    <>
      <JsonRenderer.Root config={config} />
    </>
  );
}
