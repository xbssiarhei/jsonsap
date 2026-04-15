import { Card } from "./ui/card";

interface StressTestItemProps {
  item: {
    id: number;
    value: number;
    status: string;
    lastUpdate: number;
  };
}

export function StressTestItem({ item }: StressTestItemProps) {
  // Use item.lastUpdate directly for styling without Date.now()
  const isRecent = item.lastUpdate > 0;

  return (
    <Card
      style={{
        padding: "12px 16px",
        backgroundColor: isRecent ? "#f0fdf4" : "white",
        transition: "background-color 0.3s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
          {item.value}
        </span>
      </div>
    </Card>
  );
}
