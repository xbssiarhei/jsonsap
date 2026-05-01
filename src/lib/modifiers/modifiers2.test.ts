import { describe, it, expect, vi } from "vitest";
import type { ComponentConfig, StoreInstance } from "../types";

// mock useSnapshot to return the proxy object as-is
vi.mock("valtio", () => ({
  useSnapshot: (obj: unknown) => obj,
  snapshot: (obj: unknown) => obj,
}));

import { applyModifiers2 } from "./modifiers2";

function makeStore(state: Record<string, unknown>): StoreInstance {
  return {
    state,
    actions: {},
    computed: {},
  };
}

function makeConfig(overrides: Partial<ComponentConfig> = {}): ComponentConfig {
  return { type: "div", ...overrides };
}

describe("applyModifiers2", () => {
  it("returns base props when modifiers2 is empty", () => {
    const config = makeConfig({ props: { className: "base" }, modifiers2: [] });
    const result = applyModifiers2(config, makeStore({}));
    expect(result).toEqual({ className: "base" });
  });

  it("returns base props when modifiers2 is undefined", () => {
    const config = makeConfig({ props: { className: "base" } });
    const result = applyModifiers2(config, makeStore({}));
    expect(result).toEqual({ className: "base" });
  });

  it("applies modifier when equals condition matches", () => {
    const store = makeStore({ status: "active" });
    const config = makeConfig({
      props: { className: "base" },
      modifiers2: [
        {
          conditions: [
            {
              store: { store: "@store/state", path: "status" },
              operator: "equals",
              value: "active",
            },
          ],
          props: { className: "active" },
        },
      ],
    });

    const result = applyModifiers2(config, store);
    expect(result.className).toBe("base active");
  });

  it("does not apply modifier when condition does not match", () => {
    const store = makeStore({ status: "inactive" });
    const config = makeConfig({
      props: { className: "base" },
      modifiers2: [
        {
          conditions: [
            {
              store: { store: "@store/state", path: "status" },
              operator: "equals",
              value: "active",
            },
          ],
          props: { className: "active" },
        },
      ],
    });

    const result = applyModifiers2(config, store);
    expect(result.className).toBe("base");
  });

  it("chains multiple matching modifiers", () => {
    const store = makeStore({ status: "active", priority: "high" });
    const config = makeConfig({
      props: {},
      modifiers2: [
        {
          conditions: [
            {
              store: { store: "@store/state", path: "status" },
              operator: "equals",
              value: "active",
            },
          ],
          props: { className: "active" },
        },
        {
          conditions: [
            {
              store: { store: "@store/state", path: "priority" },
              operator: "equals",
              value: "high",
            },
          ],
          props: { style: { fontWeight: "bold" } },
        },
      ],
    });

    const result = applyModifiers2(config, store);
    expect(result.className).toBe("active");
    expect((result.style as any).fontWeight).toBe("bold");
  });

  it("returns undefined when hide is true", () => {
    const store = makeStore({ status: "active" });
    const config = makeConfig({
      props: {},
      modifiers2: [
        {
          conditions: [
            {
              store: { store: "@store/state", path: "status" },
              operator: "equals",
              value: "active",
            },
          ],
          hide: true,
          props: {},
        },
      ],
    });

    const result = applyModifiers2(config, store);
    expect(result).toBeUndefined();
  });

  it("AND logic (matchAll: true) — all conditions must match", () => {
    const store = makeStore({ status: "active", role: "admin" });
    const config = makeConfig({
      props: {},
      modifiers2: [
        {
          matchAll: true,
          conditions: [
            {
              store: { store: "@store/state", path: "status" },
              operator: "equals",
              value: "active",
            },
            {
              store: { store: "@store/state", path: "role" },
              operator: "equals",
              value: "admin",
            },
          ],
          props: { className: "admin-active" },
        },
      ],
    });

    expect(applyModifiers2(config, store).className).toBe("admin-active");

    const storePartial = makeStore({ status: "active", role: "user" });
    expect(applyModifiers2(config, storePartial).className).toBeUndefined();
  });

  it("OR logic (matchAll: false) — at least one condition must match", () => {
    const store = makeStore({ status: "active", role: "user" });
    const config = makeConfig({
      props: {},
      modifiers2: [
        {
          matchAll: false,
          conditions: [
            {
              store: { store: "@store/state", path: "status" },
              operator: "equals",
              value: "active",
            },
            {
              store: { store: "@store/state", path: "role" },
              operator: "equals",
              value: "admin",
            },
          ],
          props: { className: "highlighted" },
        },
      ],
    });

    expect(applyModifiers2(config, store).className).toBe("highlighted");
  });

  it("resolves StoreRef as condition value", () => {
    const store = makeStore({ threshold: 100, value: 150 });
    const config = makeConfig({
      props: {},
      modifiers2: [
        {
          conditions: [
            {
              store: { store: "@store/state", path: "value" },
              operator: "greaterThan",
              value: { store: "@store/state", path: "threshold" },
            },
          ],
          props: { className: "over-threshold" },
        },
      ],
    });

    expect(applyModifiers2(config, store).className).toBe("over-threshold");
  });

  it("resolves nested store state path", () => {
    const store = makeStore({ user: { role: "admin" } });
    const config = makeConfig({
      props: {},
      modifiers2: [
        {
          conditions: [
            {
              store: { store: "@store/state", path: "user.role" },
              operator: "equals",
              value: "admin",
            },
          ],
          props: { className: "admin" },
        },
      ],
    });

    expect(applyModifiers2(config, store).className).toBe("admin");
  });
});
