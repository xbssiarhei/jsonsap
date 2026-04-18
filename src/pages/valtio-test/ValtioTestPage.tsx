import { proxy, useSnapshot } from "valtio";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

type Item = { id: number; value: number; lastUpdate: number };

// Store with Map
const storeWithMap = proxy({
  items: new Map<number, Item>(),
});

// Store with Array
const storeWithArray = proxy<{
  items: Array<Item>;
}>({
  items: [],
});

const proxyStore = proxy({
  map: 0,
  array: 0,
});

// Initialize data
const ITEMS_COUNT = 1000;
const MAX_COUNT_UPDATE = 100;
for (let i = 1; i <= ITEMS_COUNT; i++) {
  storeWithMap.items.set(i, proxy({ id: i, value: 0, lastUpdate: Date.now() }));
  storeWithArray.items.push({ id: i, value: 0, lastUpdate: Date.now() });
}

// Update random items in Map (up to half)
function updateRandomItemInMap() {
  const updateCount = Math.floor(Math.random() * MAX_COUNT_UPDATE) + 1;
  proxyStore.map = updateCount;
  for (let i = 0; i < updateCount; i++) {
    const randomId = Math.floor(Math.random() * ITEMS_COUNT) + 1;
    const item = storeWithMap.items.get(randomId);
    if (item) {
      item.value = Math.floor(Math.random() * 100);
      item.lastUpdate = Date.now();
    }
  }
}

// Update random items in Array (up to half)
function updateRandomItemInArray() {
  const updateCount = Math.floor(Math.random() * MAX_COUNT_UPDATE) + 1;
  proxyStore.array = updateCount;
  for (let i = 0; i < updateCount; i++) {
    const randomIndex = Math.floor(Math.random() * ITEMS_COUNT);
    const item = storeWithArray.items[randomIndex];
    if (item) {
      item.value = Math.floor(Math.random() * 100);
      item.lastUpdate = Date.now();
    }
  }
}

// Component for Map item
function MapItem({ id }: { id: number }) {
  // const snapshot = useSnapshot(storeWithMap);
  // const item = storeWithMap.items.get(id);
  const item = useSnapshot(storeWithMap.items.get(id));
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

// Component for Array item
function ArrayItem({ id }: { id: number }) {
  // const snapshot = useSnapshot(storeWithArray);
  const item = useSnapshot(storeWithArray.items.find((i) => i.id === id));
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

const CountUpdate = ({ store, name }) => {
  const value = useSnapshot(store);
  return <span>{value[name]}</span>;
};

const DELAY = 100;
export default function ValtioTestPage() {
  const [isMapRunning, setIsMapRunning] = useState(false);
  const [isArrayRunning, setIsArrayRunning] = useState(false);

  useEffect(() => {
    if (!isMapRunning) return;

    const interval = setInterval(() => {
      updateRandomItemInMap();
    }, DELAY);

    return () => clearInterval(interval);
  }, [isMapRunning]);

  useEffect(() => {
    if (!isArrayRunning) return;

    const interval = setInterval(() => {
      updateRandomItemInArray();
    }, DELAY);

    return () => clearInterval(interval);
  }, [isArrayRunning]);

  console.log("render");

  return (
    <div style={{ padding: "40px", maxWidth: "1600px", margin: "0 auto" }}>
      <h1
        style={{
          fontSize: "36px",
          fontWeight: "bold",
          marginBottom: "16px",
        }}
      >
        Valtio Performance Test: Map vs Array
      </h1>
      <p style={{ fontSize: "18px", color: "#666", marginBottom: "32px" }}>
        Testing selective re-rendering with Map and Array. Yellow background =
        component re-rendered.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px",
        }}
      >
        {/* Map Test */}
        <div>
          <Card style={{ marginBottom: "16px" }}>
            <CardHeader>
              <CardTitle>Map Store (Optimized)</CardTitle>
            </CardHeader>
            <CardContent>
              <p style={{ marginBottom: "16px", fontSize: "14px" }}>
                Using Map with direct .get(id) access. Should only re-render
                changed items.
              </p>
              <Button
                onClick={() => setIsMapRunning(!isMapRunning)}
                variant={isMapRunning ? "destructive" : "default"}
              >
                {isMapRunning ? "Stop Updates" : "Start Updates"}
              </Button>
              <CountUpdate store={proxyStore} name={"map"} />
            </CardContent>
          </Card>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: "8px",
              maxHeight: "600px",
              overflowY: "auto",
            }}
          >
            {Array.from(storeWithMap.items.values()).map((item) => (
              <MapItem key={item.id} id={item.id} />
            ))}
          </div>
        </div>

        {/* Array Test */}
        <div>
          <Card style={{ marginBottom: "16px" }}>
            <CardHeader>
              <CardTitle>Array Store (Standard)</CardTitle>
            </CardHeader>
            <CardContent>
              <p style={{ marginBottom: "16px", fontSize: "14px" }}>
                Using Array with .find(id) access. May re-render more
                components.
              </p>
              <Button
                onClick={() => setIsArrayRunning(!isArrayRunning)}
                variant={isArrayRunning ? "destructive" : "default"}
              >
                {isArrayRunning ? "Stop Updates" : "Start Updates"}
              </Button>
              <CountUpdate store={proxyStore} name={"array"} />
            </CardContent>
          </Card>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: "8px",
              maxHeight: "600px",
              overflowY: "auto",
            }}
          >
            {storeWithArray.items.map((item) => (
              <ArrayItem key={item.id} id={item.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
