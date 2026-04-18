import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { MapItem, ArrayItem, CountUpdate } from "./PerformanceItems";

interface TestColumnProps {
  title: string;
  description: string;
  isRunning: boolean;
  onToggle: () => void;
  items: any[];
  ItemComponent: typeof MapItem | typeof ArrayItem;
  store: any;
  counterStore: any;
  counterName: string;
}

/**
 * TestColumn - Renders a single test column (Map or Array)
 * Displays controls and item grid for performance testing
 */
export function TestColumn({
  title,
  description,
  isRunning,
  onToggle,
  items,
  ItemComponent,
  store,
  counterStore,
  counterName,
}: TestColumnProps) {
  return (
    <div>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4" style={{ fontSize: "14px" }}>
            {description}
          </p>
          <div className="flex justify-between">
            <Button
              onClick={onToggle}
              variant={isRunning ? "destructive" : "default"}
            >
              {isRunning ? "Stop Updates" : "Start Updates"}
            </Button>
            <CountUpdate store={counterStore} name={counterName} />
          </div>
        </CardContent>
      </Card>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: "8px",
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        {items.map((item) => (
          <ItemComponent key={item.id} id={item.id} store={store} />
        ))}
      </div>
    </div>
  );
}
