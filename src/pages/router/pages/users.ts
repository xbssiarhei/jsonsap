import type { RouteConfig } from "@/lib/router";

export const users: RouteConfig = {
  path: "users",
  ui: {
    type: "div",
    props: { className: "flex flex-col gap-4" },
    children: [
      {
        type: "h1",
        props: { className: "text-2xl font-bold" },
        children: "Users",
      },
      {
        type: "p",
        props: { className: "text-muted-foreground" },
        children: "Manage your team members",
      },
    ],
  },
};
