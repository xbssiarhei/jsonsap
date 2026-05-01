import type { ComponentConfig, StoreInstance } from "@/lib/types";
import { applyModifiers } from "./modifiers";
import { applyModifiers2 } from "./modifiers2";

export const applyConfigModifiers = (
  config: ComponentConfig,
  store: StoreInstance | null,
) => {
  let baseProps = config.props || {};
  if (config.modifiers) {
    baseProps = applyModifiers(config, store);
  }

  // should hide element
  if (!baseProps) {
    return null;
  }

  // Early return if no modifiers defined
  if (!config.modifiers2 || config.modifiers2.length === 0) {
    baseProps = applyModifiers2(
      {
        ...config,
        props: baseProps,
      },
      store,
    );
  }
  return baseProps;
};
