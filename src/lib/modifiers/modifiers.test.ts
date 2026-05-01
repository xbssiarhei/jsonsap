import { describe, it, expect } from "vitest";
import { evaluateCondition, resolveValue, mergeProps } from "./utils";

describe("evaluateCondition", () => {
  describe("equals", () => {
    it("returns true when values match", () => {
      expect(evaluateCondition({ path: "x", operator: "equals", value: "active" }, "active")).toBe(true);
    });
    it("returns false when values differ", () => {
      expect(evaluateCondition({ path: "x", operator: "equals", value: "active" }, "inactive")).toBe(false);
    });
    it("uses strict equality", () => {
      expect(evaluateCondition({ path: "x", operator: "equals", value: 1 }, "1")).toBe(false);
    });
  });

  describe("notEquals", () => {
    it("returns true when values differ", () => {
      expect(evaluateCondition({ path: "x", operator: "notEquals", value: "active" }, "inactive")).toBe(true);
    });
    it("returns false when values match", () => {
      expect(evaluateCondition({ path: "x", operator: "notEquals", value: "active" }, "active")).toBe(false);
    });
  });

  describe("greaterThan", () => {
    it("returns true when value > expected", () => {
      expect(evaluateCondition({ path: "x", operator: "greaterThan", value: 10 }, 20)).toBe(true);
    });
    it("returns false when value <= expected", () => {
      expect(evaluateCondition({ path: "x", operator: "greaterThan", value: 10 }, 10)).toBe(false);
    });
    it("returns false for non-numbers", () => {
      expect(evaluateCondition({ path: "x", operator: "greaterThan", value: 10 }, "20")).toBe(false);
    });
  });

  describe("lessThan", () => {
    it("returns true when value < expected", () => {
      expect(evaluateCondition({ path: "x", operator: "lessThan", value: 10 }, 5)).toBe(true);
    });
    it("returns false when value >= expected", () => {
      expect(evaluateCondition({ path: "x", operator: "lessThan", value: 10 }, 10)).toBe(false);
    });
  });

  describe("contains", () => {
    it("returns true when string contains substring", () => {
      expect(evaluateCondition({ path: "x", operator: "contains", value: "foo" }, "foobar")).toBe(true);
    });
    it("returns false when string does not contain substring", () => {
      expect(evaluateCondition({ path: "x", operator: "contains", value: "baz" }, "foobar")).toBe(false);
    });
    it("returns true when array contains value", () => {
      expect(evaluateCondition({ path: "x", operator: "contains", value: 2 }, [1, 2, 3])).toBe(true);
    });
    it("returns false when array does not contain value", () => {
      expect(evaluateCondition({ path: "x", operator: "contains", value: 5 }, [1, 2, 3])).toBe(false);
    });
    it("returns false for non-string/non-array", () => {
      expect(evaluateCondition({ path: "x", operator: "contains", value: 1 }, 123)).toBe(false);
    });
  });
});

describe("resolveValue", () => {
  const props = {
    status: "active",
    item: { id: 1, name: "Test", nested: { value: 42 } },
  };
  const state = { theme: "dark", user: { role: "admin" } };
  const computed = { total: 100 };

  it("resolves top-level prop", () => {
    expect(resolveValue("status", props, null, null)).toBe("active");
  });

  it("resolves nested prop path", () => {
    expect(resolveValue("item.name", props, null, null)).toBe("Test");
  });

  it("resolves deeply nested prop path", () => {
    expect(resolveValue("item.nested.value", props, null, null)).toBe(42);
  });

  it("returns undefined for unknown path", () => {
    expect(resolveValue("unknown.path", props, null, null)).toBeUndefined();
  });

  it("resolves @store.state reference", () => {
    expect(resolveValue("@store.state.theme", props, state, null)).toBe("dark");
  });

  it("resolves nested @store.state reference", () => {
    expect(resolveValue("@store.state.user.role", props, state, null)).toBe("admin");
  });

  it("resolves @store.computed reference", () => {
    expect(resolveValue("@store.computed.total", props, null, computed)).toBe(100);
  });

  it("returns undefined for @store.state when no state", () => {
    expect(resolveValue("@store.state.theme", props, null, null)).toBeUndefined();
  });
});

describe("mergeProps", () => {
  it("overrides scalar prop", () => {
    const result = mergeProps({ color: "red" }, { color: "blue" });
    expect(result.color).toBe("blue");
  });

  it("deep merges style objects", () => {
    const result = mergeProps(
      { style: { color: "red", fontSize: 12 } },
      { style: { fontSize: 16, fontWeight: "bold" } },
    );
    expect(result.style).toEqual({ color: "red", fontSize: 16, fontWeight: "bold" });
  });

  it("concatenates className strings", () => {
    const result = mergeProps({ className: "base" }, { className: "extra" });
    expect(result.className).toBe("base extra");
  });

  it("sets className when base has none", () => {
    const result = mergeProps({}, { className: "extra" });
    expect(result.className).toBe("extra");
  });

  it("does not mutate base props", () => {
    const base = { className: "base", style: { color: "red" } };
    mergeProps(base, { className: "extra", style: { color: "blue" } });
    expect(base.className).toBe("base");
    expect(base.style.color).toBe("red");
  });

  it("keeps base props not present in override", () => {
    const result = mergeProps({ a: 1, b: 2 }, { b: 99 });
    expect(result.a).toBe(1);
    expect(result.b).toBe(99);
  });
});
