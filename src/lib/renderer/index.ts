import { JsonRendererRoot } from "./root";
import { JsonRenderer as JsonRendererBase } from "./main";

export { JsonRendererRoot } from "./root";
export type { JsonRendererProps, JsonRendererInternalProps } from "./types";

export const JsonRenderer = Object.assign(JsonRendererBase, {
  Root: JsonRendererRoot,
});
