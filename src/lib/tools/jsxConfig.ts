import type { ComponentConfig } from "@/lib/types";

type Child = ComponentConfig | string | number | null | undefined | boolean;

export function jsxConfig(
  type: string,
  props: Record<string, unknown> | null,
  ...children: Child[]
): ComponentConfig {
  const { slots, children: propsChildren, ...restProps } = props ?? {};

  const rawChildren = [
    ...children,
    ...(propsChildren !== undefined ? [propsChildren as Child] : []),
  ].filter((c): c is ComponentConfig | string | number => {
    return c !== null && c !== undefined && c !== false && c !== true;
  });

  const finalChildren =
    rawChildren.length === 0
      ? undefined
      : rawChildren.length === 1
        ? rawChildren[0]
        : rawChildren;

  const t = typeof type === "function" ? type.name : String(type);
  const resolvedRestProps = {};
  for (const key in restProps) {
    if (key.startsWith("__")) {
      continue;
    }
    resolvedRestProps[key] = restProps[key];
  }

  return {
    type: t,
    ...(Object.keys(resolvedRestProps).length > 0
      ? { props: resolvedRestProps }
      : {}),
    ...(finalChildren !== undefined
      ? { children: finalChildren as ComponentConfig["children"] }
      : {}),
    ...(slots ? { slots: slots as ComponentConfig["slots"] } : {}),
  };
}

export const Fragment = "Fragment";
