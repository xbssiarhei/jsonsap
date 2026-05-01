/** @jsxRuntime classic */
/** @jsx jsxConfig */
import type { ComponentConfig } from "@/lib";
import { Button } from "@/components/ui/button";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsxConfig } from "../tools/jsxConfig";

export const panelConfig: ComponentConfig = (
  <Panel
    slots={{
      header: <h1 className="text-xl">Title</h1>,
      footer: <Button variant="outline">Save</Button>,
    }}
  >
    <div className="p-4">Body content</div>
  </Panel>
);

console.log(panelConfig);

function Panel({ children, slots }: any) {
  return (
    <div>
      {slots.header}
      {children}
      {slots.footer}
    </div>
  );
}
