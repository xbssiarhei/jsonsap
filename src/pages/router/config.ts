import type { RouterAppConfig } from "@/lib/router";

type State = {
  user: { name: string } | null;
  notifications: number;
};

export const config: RouterAppConfig<State> = {
  store: {
    state: {
      user: { name: "Sergey" },
      notifications: 3,
    },
    actions: {
      logout: (state) => {
        state.user = null;
      },
    },
  },

  layouts: {
    main: {
      type: "div",
      props: { className: "flex h-full min-h-screens" },
      children: [
        {
          type: "div",
          props: {
            className:
              "w-52 border-r flex flex-col gap-1 p-3 bg-muted/30 shrink-0",
          },
          children: [
            {
              type: "div",
              props: { className: "font-bold text-lg px-2 py-3 mb-1" },
              children: "jsonsap app",
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
              props: { className: "flex-1 p-6 overflow-auto" },
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
          className:
            "flex items-center justify-center min-h-screen bg-muted/20",
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
            props: { className: "flex flex-col gap-4" },
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
                          children: "42",
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

        {
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
        },

        {
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
        },
      ],
    },
  ],
};
