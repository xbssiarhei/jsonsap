import { cn } from "@/lib/utils";

export const Icon = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => (
  <span className={cn("text-xl contents", className)}>
    <i className={"icon icon-" + name}></i>
  </span>
);
