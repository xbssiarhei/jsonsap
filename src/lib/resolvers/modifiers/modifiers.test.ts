import { describe, it, expect } from "vitest";
import type { Any, Modifier } from "../../types";
import { resolveModifiers } from "./modifiers";

const activeModifier: Modifier = {
  conditions: [{ path: "item.status", operator: "equals", value: "active" }],
  props: { style: { backgroundColor: "#e6ffe6" } },
};

const highlightModifier: Modifier = {
  conditions: [{ path: "item.value", operator: "greaterThan", value: 100 }],
  props: { className: "font-bold" },
};

const shared: Any = {
  modifiers: {
    active: activeModifier,
    highlight: highlightModifier,
  },
};

describe("resolveModifiers", () => {
  it("returns empty array for undefined", () => {
    expect(resolveModifiers(undefined, shared)).toEqual([]);
  });

  it("returns single modifier object as array", () => {
    const result = resolveModifiers(activeModifier, shared);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(activeModifier);
  });

  it("returns array of modifier objects as-is", () => {
    const result = resolveModifiers(
      [activeModifier, highlightModifier],
      shared,
    );
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(activeModifier);
    expect(result[1]).toEqual(highlightModifier);
  });

  it("resolves single @shared/modifiers/ string reference", () => {
    const result = resolveModifiers("@shared/modifiers/active", shared);
    expect(result).toHaveLength(1);
    expect(result[0].conditions[0].operator).toBe("equals");
    expect(result[0].props).toEqual({ style: { backgroundColor: "#e6ffe6" } });
  });

  it("resolves @modifiers/ shorthand reference", () => {
    const result = resolveModifiers("@modifiers/highlight", shared);
    expect(result).toHaveLength(1);
    expect(result[0].props).toEqual({ className: "font-bold" });
  });

  it("resolves array of string references", () => {
    const result = resolveModifiers(
      ["@modifiers/active", "@modifiers/highlight"],
      shared,
    );
    expect(result).toHaveLength(2);
  });

  it("resolves mixed array of objects and string references", () => {
    const inlineModifier: Modifier = {
      conditions: [{ path: "item.id", operator: "equals", value: 1 }],
      props: { className: "selected" },
    };
    const result = resolveModifiers(
      [inlineModifier, "@modifiers/active"],
      shared,
    );
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(inlineModifier);
    expect(result[1].props).toEqual({ style: { backgroundColor: "#e6ffe6" } });
  });

  it("filters out null results for unknown references", () => {
    const result = resolveModifiers("@modifiers/nonexistent", shared);
    expect(result).toHaveLength(0);
  });

  it("returns copy of modifier, not original reference", () => {
    const result = resolveModifiers("@modifiers/active", shared);
    expect(result[0]).not.toBe(activeModifier);
    expect(result[0]).toEqual(activeModifier);
  });
});
