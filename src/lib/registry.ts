import type { ComponentType } from "react";
import type { ComponentRegistry } from "./types";

class Registry {
  private components: ComponentRegistry = new Map();

  register(name: string, component: ComponentType<unknown>): void {
    this.components.set(name, component);
  }

  get(name: string): ComponentType<unknown> | undefined {
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
