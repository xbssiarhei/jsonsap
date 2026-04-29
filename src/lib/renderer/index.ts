import { JsonRendererRoot } from "./root";
import { JsonRenderer } from "./main";

export { JsonRenderer } from "./main";
export { JsonRendererRoot } from "./root";
export type { JsonRendererProps, JsonRendererInternalProps } from "./types";

// @ts-expect-error skip
JsonRenderer.Root = JsonRendererRoot;
