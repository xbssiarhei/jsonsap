import type { StoreConfig } from "@/lib";
import type { RouterAppConfig } from "@/lib/router";
import { proxy } from "valtio";
import { pages } from "./pages";
import { cardConfig, tabsConfig } from "./components/configs";

type State = {
  user: { name: string } | null;
  notifications: number;
  users: number;
};

const store: StoreConfig<State> = proxy({
  state: {
    user: { name: "Sergey" },
    notifications: 3,
    users: 39,
    tab: "units",
    _isProxy: true,
  },
  actions: {
    logout: (state) => {
      state.user = null;
    },
  },
});

setInterval(() => {
  // store.state.items.forEach((item) => {
  //   item.value = Math.floor(Math.random() * 100);
  // });
  store.state.notifications = Math.floor(Math.random() * 100);
  store.state.users = Math.floor(Math.random() * 100);
}, 1000);

export const config: RouterAppConfig<State> = {
  store,
  shared: {
    components: {
      logo: {
        type: "div",
        // props: { className: "font-bold text-lg px-2 py-3 mb-1" },
        props: { className: "font-bold text-lg" },
        children: "jsonsap app",
      },
      ItemCard: cardConfig,
      tabsConfig,
    },
  },

  layouts: {
    main: {
      type: "SidebarProvider",
      props: {
        className: "flex contents_ h-full w-full min-h-screens min-h-full",
      },
      children: [
        {
          type: "AppSidebar",
          props: {
            className:
              "w-52 border-r flex flex-col gap-1 p-3 bg-muted/30 shrink-0",
            menuItems: [
              { id: "home", to: "/router", label: "Home", icon: "home" },
              {
                id: "live",
                to: "/router/live",
                label: "Live",
                icon: "radio-tower",
              },
              {
                id: "users",
                to: "/router/users",
                label: "Users",
                icon: "users",
              },
              {
                id: "settings",
                to: "/router/settings",
                label: "Settings",
                icon: "settings",
              },
              {
                id: "login",
                to: "/router/login",
                label: "Login",
                icon: "file-question-mark",
              },
              {
                id: "404",
                to: "/router/404",
                label: "404",
                icon: "file-question-mark",
              },
            ],
          },
          slots: {
            header: {
              type: "Fragment",
              children: "@shared/components/logo",
            },
          },
          children: [
            {
              type: "Fragment",
              children: "@shared/components/logo",
            },
            {
              type: "NavLink",
              props: {
                to: "/router",
                end: true,
                className:
                  "px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors",
              },
              children: "Home",
            },
            {
              type: "NavLink",
              props: {
                to: "/router/live",
                className:
                  "px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors",
              },
              children: "Live",
            },
            {
              type: "NavLink",
              props: {
                to: "/router/users",
                className:
                  "px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors",
              },
              children: "Users",
            },
            {
              type: "NavLink",
              props: {
                to: "/router/settings",
                className:
                  "px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors",
              },
              children: "Settings",
            },
            {
              type: "div",
              props: {
                className: "mt-auto px-2 py-2 text-sm text-muted-foreground",
              },
              children: "User: @store.state.user.name",
            },
          ],
        },
        {
          type: "div",
          props: { className: "flex flex-col flex-1" },
          children: [
            {
              type: "div",
              props: {
                className: "border-b p-4",
              },
              children: "top menu",
            },
            {
              type: "div",
              props: { className: "flex-1 p-0 overflow-auto" },
              children: [{ type: "Outlet" }],
            },
          ],
        },
      ],
    },
  },

  routes: [
    {
      path: "/login",
      ui: {
        type: "div",
        props: {
          className: "flex items-center justify-center min-h-full bg-muted/20",
        },
        children: [
          {
            type: "div",
            props: {
              className:
                "bg-background border rounded-xl p-8 w-80 flex flex-col gap-4 shadow-sm",
            },
            children: [
              {
                type: "h1",
                props: { className: "text-2xl font-bold" },
                children: "Sign In",
              },
              {
                type: "p",
                props: { className: "text-muted-foreground text-sm" },
                children: "Enter your credentials to continue",
              },
              { type: "Input", props: { placeholder: "Email" } },
              {
                type: "Input",
                props: { placeholder: "Password", type: "password" },
              },
              {
                type: "Button",
                props: { className: "w-full" },
                children: "Login",
              },
              {
                type: "div",
                props: {
                  className: "text-center text-sm text-muted-foreground",
                },
                children: [
                  { type: "span", children: "No account? " },
                  {
                    type: "Link",
                    props: { to: "/router", className: "underline" },
                    children: "Back to app",
                  },
                ],
              },
            ],
          },
        ],
      },
    },

    {
      path: "/",
      layout: "main",
      children: [
        {
          index: true,
          ui: {
            type: "div",
            props: { className: "flex flex-col gap-4 p-4" },
            children: [
              {
                type: "h1",
                props: { className: "text-2xl font-bold" },
                children: "Home",
              },
              {
                type: "p",
                props: { className: "text-muted-foreground" },
                children: "Welcome back, @store.state.user.name!",
              },
              {
                type: "div",
                props: { className: "grid grid-cols-3 gap-4 mt-4" },
                children: [
                  {
                    type: "Card",
                    children: [
                      {
                        type: "CardHeader",
                        children: [
                          { type: "CardTitle", children: "Notifications" },
                          {
                            type: "CardDescription",
                            children: "Unread messages",
                          },
                        ],
                      },
                      {
                        type: "CardContent",
                        children: {
                          type: "p",
                          props: { className: "text-3xl font-bold" },
                          children: "@store.state.notifications",
                        },
                      },
                    ],
                  },
                  {
                    type: "Card",
                    children: [
                      {
                        type: "CardHeader",
                        children: [
                          { type: "CardTitle", children: "Users" },
                          {
                            type: "CardDescription",
                            children: "Active accounts",
                          },
                        ],
                      },
                      {
                        type: "CardContent",
                        children: {
                          type: "p",
                          props: { className: "text-3xl font-bold" },
                          children: "@store.state.users",
                        },
                      },
                    ],
                  },
                  {
                    type: "Card",
                    children: [
                      {
                        type: "CardHeader",
                        children: [
                          { type: "CardTitle", children: "Status" },
                          {
                            type: "CardDescription",
                            children: "System health",
                          },
                        ],
                      },
                      {
                        type: "CardContent",
                        children: {
                          type: "Badge",
                          props: { variant: "outline" },
                          children: "Online",
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },

        pages.live,

        pages.users,

        pages.settings,
      ],
    },
    // * path
    {
      path: "*",
      ui: {
        type: "div",
        props: {
          className:
            "flex flex-col items-center justify-center gap-4 min-h-full bg-muted/20",
        },
        children: [
          {
            type: "div",
            children: "404 - Page not found",
          },
          {
            type: "Button",
            props: {
              asChild: true,
            },

            children: [
              {
                type: "NavLink",
                props: {
                  to: "/router/",
                  // className:
                  // "px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors",
                },
                children: "Back to home",
              },
            ],
          },
          {
            type: "NavLink",
            props: {
              to: "/router/",
              className:
                "px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors",
            },
            children: "Back to home",
          },
        ],
      },
    },
  ],
};
