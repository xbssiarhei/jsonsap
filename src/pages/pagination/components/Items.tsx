import { type ComponentConfig } from "@/lib";
import { RepeaterItem, RepeaterItemArray } from "@/lib/components/Repeater2";
import { getNestedValue } from "@/lib/components/repeaterUtils";

declare module "@/lib/types" {
  export interface ComponentConfigType {
    Items: string;
  }
}

type ItemsProps = {
  items?: Array<{ id: number; name: string; value: number }>;
  template: ComponentConfig;
  children?: React.ReactNode;
  className?: string;
  storeItem?: any;
};

export const Items = ({
  className,
  items,
  storeItem,
  template,
  children,
}: ItemsProps) => {
  // Choose appropriate item component based on data structure
  const Item = storeItem ? RepeaterItemArray : RepeaterItem;
  const getId = (item: any) => getNestedValue(item, ["id"]);
  return (
    <>
      <div className={className}>
        {/* {items?.length > 0
          ? items?.map((item, index) => {
              const resolvedConfig = resolveItemReferences(
                template,
                item,
              ) as ComponentConfig;
              const id = item.id;

              return (
                <JsonRenderer
                  key={id ?? index}
                  config={resolvedConfig}
                  context={{ item }}
                />
              );
            })
          : "No items"} */}
        {items?.map((item, index) => {
          const id = getId(item) as string;
          return (
            <Item
              key={id ?? index}
              template={template}
              store={storeItem}
              getId={getId}
              id={id}
              item={item}
            />
          );
        })}
      </div>
      {children}
    </>
  );
};
