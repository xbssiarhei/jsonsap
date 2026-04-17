import type { ComponentProps, PropsWithChildren } from "react";
import { Card } from "./ui/card";

interface StressTestItemProps extends PropsWithChildren {
  item: {
    id: number;
    value: number;
    status: string;
    lastUpdate: number;
  };
  style?: ComponentProps<"div">["style"];
}

export function StressTestItem({ item, style, children }: StressTestItemProps) {
  // Use item.lastUpdate directly for styling without Date.now()
  const isRecent = item.lastUpdate > 0;

  return (
    <Card
      style={{
        padding: "12px 16px",
        backgroundColor: isRecent ? "#f0fdf4" : "white",
        transition: "background-color 0.3s ease",
        ...style,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span style={{ fontWeight: "bold", fontSize: "14px" }}>
            #{item.id}
          </span>
          <span
            style={{
              padding: "2px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              backgroundColor: item.status === "active" ? "#dbeafe" : "#f3f4f6",
              color: item.status === "active" ? "#1e40af" : "#6b7280",
            }}
          >
            {item.status}
          </span>
        </div>
        <span style={{ fontSize: "20px", fontWeight: "bold" }}>
          {/* <NumericRoller value={item.value} size={20} /> */}
          {/* <Roller size={20} value={item.value} /> */}
          {/* {item.value} */}
          {children}
        </span>
      </div>
    </Card>
  );
}
