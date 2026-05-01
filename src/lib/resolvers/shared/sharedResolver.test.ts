import { describe, it, expect } from "vitest";
import type { AppConfig } from "../../types";
import { resolveSharedReferences } from "./sharedResolver";

const shared: any = {
  components: {
    tabs: {
      type: "Tabs" as const,
      props: {
        className: "w-full",
        value: "@store.state.tab",
      },
    },
    card: {
      type: "Card" as const,
      props: { className: "p-4" },
      children: [{ type: "CardContent" as const, children: "default" }],
    },
  },
};

describe("resolveSharedReferences — @shared/components extend", () => {
  it("resolves @shared/components/tabs without overrides", () => {
    const config = { type: "@shared/components/tabs" as any };
    const result = resolveSharedReferences(config, shared) as any;

    expect(result.type).toBe("Tabs");
    expect(result.props.className).toBe("w-full");
    expect(result.props.value).toBe("@store.state.tab");
  });

  it("merges props on top of shared component", () => {
    const config = {
      type: "@shared/components/tabs" as any,
      props: { defaultValue: "tab1" },
    };
    const result = resolveSharedReferences(config, shared) as any;

    expect(result.type).toBe("Tabs");
    expect(result.props.className).toBe("w-full");
    expect(result.props.value).toBe("@store.state.tab");
    expect(result.props.defaultValue).toBe("tab1");
  });

  it("override prop wins over shared prop", () => {
    const config = {
      type: "@shared/components/tabs" as any,
      props: { className: "w-auto" },
    };
    const result = resolveSharedReferences(config, shared) as any;

    expect(result.props.className).toBe("w-auto");
  });

  it("overrides children", () => {
    const config = {
      type: "@shared/components/card" as any,
      children: [{ type: "CardContent" as const, children: "custom" }],
    };
    const result = resolveSharedReferences(config, shared) as any;

    expect(result.children[0].children).toBe("custom");
  });

  it("supports @components/ shorthand", () => {
    const config = { type: "@components/tabs" as any };
    const result = resolveSharedReferences(config, shared) as any;

    expect(result.type).toBe("Tabs");
  });

  it("does not include type field from override", () => {
    const config = { type: "@shared/components/tabs" as any };
    const result = resolveSharedReferences(config, shared) as any;

    expect(result.type).toBe("Tabs");
    expect(result.type).not.toBe("@shared/components/tabs");
  });
});

describe("resolveSharedReferences — root ui", () => {
  it("resolves @shared/components reference in ui.children", () => {
    const config: AppConfig<any> = {
      shared,
      store: { state: {} },
      ui: {
        type: "div",
        children: [{ type: "@shared/components/tabs" as any }],
      },
    };

    const result = resolveSharedReferences(config, shared) as any;
    expect(result.ui.children[0].type).toBe("Tabs");
    expect(result.ui.children[0].props.className).toBe("w-full");
  });

  it("resolves @shared/components reference at ui root", () => {
    const config: AppConfig<any> = {
      shared,
      store: { state: {} },
      ui: { type: "@shared/components/card" as any },
    };

    const result = resolveSharedReferences(config, shared) as any;
    expect(result.ui.type).toBe("Card");
    expect(result.ui.props.className).toBe("p-4");
  });

  it("merges props on nested shared component in ui", () => {
    const config: AppConfig<any> = {
      shared,
      store: { state: {} },
      ui: {
        type: "div",
        children: [
          {
            type: "@shared/components/tabs" as any,
            props: { defaultValue: "tab2" },
          },
        ],
      },
    };

    const result = resolveSharedReferences(config, shared) as any;
    const child = result.ui.children[0];
    expect(child.type).toBe("Tabs");
    expect(child.props.className).toBe("w-full");
    expect(child.props.defaultValue).toBe("tab2");
  });

  it("does not mutate store config", () => {
    const storeState = { tab: "a" };
    const config: AppConfig<any> = {
      shared,
      store: { state: storeState },
      ui: { type: "@shared/components/tabs" as any },
    };

    resolveSharedReferences(config, shared);
    expect(storeState).toEqual({ tab: "a" });
  });
});
