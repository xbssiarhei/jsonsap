import { JsonRenderer } from "@/lib/renderer";
import { useCollectionContext } from "./StoreCollectionContext";
import { resolveItemReferences } from "../repeaterUtils";

export function CollectionRepeater({ template }) {
  const { collection, getId } = useCollectionContext();

  if (!template) {
    console.warn("CollectionRepeater: template is required");
    return null;
  }

  return (
    <>
      {collection.map((item, index) => {
        const id = getId(item);
        const resolvedConfig = resolveItemReferences(template, item);

        return (
          <JsonRenderer
            key={id ?? index}
            config={resolvedConfig}
            context={{ item }}
          />
        );
      })}
    </>
  );
}
