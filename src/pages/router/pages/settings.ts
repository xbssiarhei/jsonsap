import type { RouteConfig } from "@/lib/router";

export const settings: RouteConfig = {
  path: "settings",
  ui: {
    type: "div",
    props: { className: "flex flex-col gap-4" },
    children: [
      {
        type: "h1",
        props: { className: "text-2xl font-bold" },
        children: "Settings",
      },
      {
        type: "p",
        props: { className: "text-muted-foreground" },
        children: "Configure your application",
      },
      {
        type: "Button",
        props: {
          variant: "destructive",
          onClick: "@store.actions.logout",
        },
        children: "Logout",
      },
    ],
  },
};
