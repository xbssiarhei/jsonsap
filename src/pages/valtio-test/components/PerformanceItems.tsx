import { useSnapshot } from "valtio";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../../../components/ui/card";

/**
 * MapItem - Renders a single item from Map store
 * Uses useSnapshot on individual item for selective re-rendering
 */
export function MapItem({ id, store }: { id: number; store: any }) {
  const item = useSnapshot(store.items.get(id));
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    setRenderCount((c) => c + 1);
  }, [item]);

  if (!item) return null;

  return (
    <Card
      style={{
        backgroundColor: renderCount > 1 ? "#fef3c7" : "#f3f4f6",
        transition: "background-color 0.3s",
      }}
    >
      <CardContent style={{ padding: "12px" }}>
        <div style={{ fontSize: "12px", color: "#666" }}>ID: {item.id}</div>
        <div style={{ fontSize: "20px", fontWeight: "bold" }}>
          Value: {item.value}
        </div>
        <div style={{ fontSize: "10px", color: "#999" }}>
          Renders: {renderCount}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * ArrayItem - Renders a single item from Array store
 * Uses useSnapshot on found item for selective re-rendering
 */
export function ArrayItem({ id, store }: { id: number; store: any }) {
  const item = useSnapshot(store.items.find((i: any) => i.id === id));
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    setRenderCount((c) => c + 1);
  }, [item]);

  if (!item) return null;

  return (
    <Card
      style={{
        backgroundColor: renderCount > 1 ? "#fef3c7" : "#f3f4f6",
        transition: "background-color 0.3s",
      }}
    >
      <CardContent style={{ padding: "12px" }}>
        <div style={{ fontSize: "12px", color: "#666" }}>ID: {item.id}</div>
        <div style={{ fontSize: "20px", fontWeight: "bold" }}>
          Value: {item.value}
        </div>
        <div style={{ fontSize: "10px", color: "#999" }}>
          Renders: {renderCount}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * CountUpdate - Displays update count from store
 */
export function CountUpdate({ store, name }: { store: any; name: string }) {
  const value = useSnapshot(store);
  return (
    <div className="space-y-1 flex flex-col items-end">
      {/* <h4 className="font-semibold text-sm leading-none">Radix Primitives</h4> */}
      <p className="text-muted-foreground text-sm">
        How many items to update at once.
      </p>
      <span>{value[name]}</span>
    </div>
  );
}
