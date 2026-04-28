import { JsonRenderer, type ComponentConfig } from "@/lib";
import { RepeaterItem } from "@/lib/components/Repeater2";

declare module "@/lib/types" {
  export interface ComponentConfigType {
    Views: string;
  }

  export interface ComponentConfig {
    views?: Record<string, ComponentConfig>;
  }
}

export const Views = ({ view, views, children, ...props }) => {
  // console.log(props);

  const template = views?.[view] ?? {};

  return (
    <>
      <JsonRenderer
        config={
          {
            ...template,
            props: {
              ...template.props,
              ...props,
            },
          } as ComponentConfig
        }
      />
      {children}
    </>
  );
};
