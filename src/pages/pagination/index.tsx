import { RootEngine } from "./engine";
import { config } from "./TestPage";
import { PageView } from "@/components/PageView";

export default function TestPageView() {
  return (
    <>
      <RootEngine></RootEngine>
      <PageView key={String(Date.now())} config={config} />
    </>
  );
}
