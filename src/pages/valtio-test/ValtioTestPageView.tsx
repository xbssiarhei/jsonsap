import { useEffect, useState } from "react";
import {
  proxyStore,
  storeWithArray,
  storeWithMap,
  updateRandomItemInArray,
  updateRandomItemInMap,
} from "./store";
import config from "./ValtioTestConfig";
import { MapItem, ArrayItem } from "./components/PerformanceItems";
import { TestColumn } from "./components/TestColumn";
import { useSnapshot } from "valtio";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageView } from "@/components/PageView";

// const DELAY = 100;

/**
 * ValtioTestPageView - Performance comparison between Map and Array with Valtio
 *
 * Demonstrates:
 * - Selective re-rendering with Map.get(id) vs Array.find(id)
 * - Visual feedback (yellow background) when component re-renders
 * - Update counters to track render frequency
 * - Side-by-side comparison of both approaches
 */
export function ValtioTestPageView() {
  const [isMapRunning, setIsMapRunning] = useState(false);
  const [isArrayRunning, setIsArrayRunning] = useState(false);

  const delay = useSnapshot(proxyStore).delay;

  // Map updates interval
  useEffect(() => {
    if (!isMapRunning) return;

    const interval = setInterval(() => {
      updateRandomItemInMap();
    }, delay);

    return () => clearInterval(interval);
  }, [isMapRunning, delay]);

  // Array updates interval
  useEffect(() => {
    if (!isArrayRunning) return;

    const interval = setInterval(() => {
      updateRandomItemInArray();
    }, delay);

    return () => clearInterval(interval);
  }, [isArrayRunning, delay]);

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

      <div className="flex py-2">
        <Select
          onValueChange={(value) => (proxyStore.delay = Number(value))}
          value={String(delay)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Interval between updates</SelectLabel>
              <SelectItem value="50">50ms</SelectItem>
              <SelectItem value="100">100ms</SelectItem>
              <SelectItem value="500">500ms</SelectItem>
              <SelectItem value="1000">1s</SelectItem>
              <SelectItem value="2000">2s</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px",
        }}
      >
        {/* Map Test Column */}
        <TestColumn
          title="Map Store (Optimized)"
          description="Using Map with direct .get(id) access. Should only re-render changed items."
          isRunning={isMapRunning}
          onToggle={() => setIsMapRunning(!isMapRunning)}
          items={Array.from(storeWithMap.items.values())}
          ItemComponent={MapItem}
          store={storeWithMap}
          counterStore={proxyStore}
          counterName="map"
        />

        {/* Array Test Column */}
        <TestColumn
          title="Array Store (Standard)"
          description="Using Array with .find(id) access. May re-render more components."
          isRunning={isArrayRunning}
          onToggle={() => setIsArrayRunning(!isArrayRunning)}
          items={storeWithArray.items}
          ItemComponent={ArrayItem}
          store={storeWithArray}
          counterStore={proxyStore}
          counterName="array"
        />
      </div>

      {/* JSON Config Demo */}
      <PageView config={config} />
    </div>
  );
}

export default ValtioTestPageView;
