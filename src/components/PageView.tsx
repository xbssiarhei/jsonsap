import { useState } from "react";
import { JsonRenderer, type AppConfig } from "../lib";
import { ConfigEditor } from "./ConfigEditor";

interface PageViewProps {
  config: AppConfig<any>;
}

/**
 * PageView - Common wrapper for all JSON-driven pages
 *
 * Features:
 * - Live config editor (top-right corner)
 * - JsonRenderer for rendering UI from config
 * - State management for config changes
 *
 * Usage:
 * ```tsx
 * export function MyPageView() {
 *   return <PageView config={myPageConfig} />;
 * }
 * ```
 */
export function PageView({ config: initialConfig }: PageViewProps) {
  const [config, setConfig] = useState(initialConfig);

  return (
    <>
      <div
        style={{ position: "fixed", top: "80px", right: "24px", zIndex: 1000 }}
      >
        <ConfigEditor config={config} onConfigChange={setConfig} />
      </div>
      <JsonRenderer.Root config={config} />
    </>
  );
}
