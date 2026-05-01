// import type { ComponentType } from "react";
import type {
  ComponentRegistry,
  LibComponent,
  ComponentMetadata,
} from "./types";

class Registry {
  private components: ComponentRegistry = new Map();

  // Overload signatures for backward compatibility
  register(name: string, component: LibComponent): void;
  register(
    name: string,
    component: LibComponent,
    options: { requiredPlugins?: string[] },
  ): void;
  register(
    name: string,
    component: LibComponent,
    options?: { requiredPlugins?: string[] },
  ): void {
    this.components.set(name, {
      component,
      requiredPlugins: options?.requiredPlugins,
    });
  }

  registerMany(rootName: string, dictComponents: Record<string, LibComponent>) {
    for (const [name, component] of Object.entries(dictComponents)) {
      const key = rootName ? [rootName, name].join(".") : name;
      this.register(key, component);
    }
  }

  get(name: string): ComponentMetadata | undefined {
    return this.components.get(name);
  }

  has(name: string): boolean {
    return this.components.has(name);
  }

  unregister(name: string): boolean {
    return this.components.delete(name);
  }

  clear(): void {
    this.components.clear();
  }

  getAll(): ComponentRegistry {
    return new Map(this.components);
  }
}

export const componentRegistry = new Registry();
