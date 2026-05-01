// import type { ComponentConfig } from "@/lib";
import type { RouteConfig } from "@/lib/router";
import { live } from "./live";
import { users } from "./users";
import { settings } from "./settings";

export const pages: Record<string, RouteConfig> = {
  live,
  users,
  settings,
};
