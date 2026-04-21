import { componentRegistry } from "@/lib";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

declare module "@/lib/types" {
  export interface ComponentConfigType {
    PageRoot: string;
  }
}

export const PageRoot = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      className={cn("max-w-6xl mx-auto p-10 border-x", className)}
      {...props}
    ></div>
  );
};
// border-inline: 1px solid var(--border);

componentRegistry.register("PageRoot", PageRoot);
