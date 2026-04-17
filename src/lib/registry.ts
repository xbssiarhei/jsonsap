// import type { ComponentType } from "react";
import type { ComponentRegistry, LibComponent } from "./types";

class Registry {
  private components: ComponentRegistry = new Map();

  register(name: string, component: LibComponent): void {
    this.components.set(name, component);
  }

  get(name: string): LibComponent | undefined {
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
