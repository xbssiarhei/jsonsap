import { config } from "./TestPage";
import { PageView } from "@/components/PageView";

export default function TestPageView() {
  return (
    <>
      <PageView key={String(Date.now())} config={config} />
    </>
  );
}
