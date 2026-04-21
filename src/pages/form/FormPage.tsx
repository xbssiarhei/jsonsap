import {
  pluginRegistry,
  type AppConfig,
  type StoreConfig,
  autoBindPlugin,
} from "../../lib";

// Register autoBind plugin
pluginRegistry.register(autoBindPlugin);

type FormState = {
  username: string;
  email: string;
  age: string;
  newsletter: boolean;
  bio: string;
  // New fields to demonstrate SetAction
  firstName: string;
  lastName: string;
  phone: string;
};

const store: StoreConfig<FormState> = {
  state: {
    username: "",
    email: "",
    age: "",
    newsletter: false,
    bio: "",
    firstName: "",
    lastName: "",
    phone: "",
  },
  actions: {
    resetForm: (state) => {
      state.username = "";
      state.email = "";
      state.age = "";
      state.newsletter = false;
      state.bio = "";
      state.firstName = "";
      state.lastName = "";
      state.phone = "";
    },
  },
  computed: {
    isValid: (state) => {
      return state.username.length > 0 && state.email.includes("@");
    },
    formData: (state) => {
      return JSON.stringify(state, null, 2);
    },
  },
};

export const formPageConfig: AppConfig<FormState> = {
  store: store,
  ui: {
    type: "PageRoot",
    props: {
      className: "max-w-4xl",
      style: {
        maxWidth: "800px",
      },
    },
    children: [
      {
        type: "h1",
        props: {
          style: {
            fontSize: "36px",
            fontWeight: "bold",
            marginBottom: "16px",
          },
        },
        children: "Auto-Bind Form Demo",
      },
      {
        type: "p",
        props: {
          style: {
            fontSize: "18px",
            color: "#666",
            marginBottom: "32px",
          },
        },
        children:
          "Demonstrates two binding methods: autoBind plugin and SetAction syntax",
      },
      {
        type: "Card",
        props: {
          style: {
            marginBottom: "24px",
          },
        },
        children: [
          {
            type: "CardHeader",
            children: [
              {
                type: "CardTitle",
                children: "AutoBind Plugin Method",
              },
              {
                type: "CardDescription",
                children: "Uses autoBind prop with plugin",
              },
            ],
          },
          {
            type: "CardContent",
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  },
                },
                children: [
                  {
                    type: "div",
                    children: [
                      {
                        type: "label",
                        props: {
                          style: {
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "500",
                            marginBottom: "8px",
                          },
                        },
                        children: "Username",
                      },
                      {
                        type: "Input",
                        props: {
                          type: "text",
                          placeholder: "Enter username",
                          value: "@store.state.username",
                          autoBind: "username",
                        },
                        plugins: ["autoBind"],
                      },
                    ],
                  },
                  {
                    type: "div",
                    children: [
                      {
                        type: "label",
                        props: {
                          style: {
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "500",
                            marginBottom: "8px",
                          },
                        },
                        children: "Email",
                      },
                      {
                        type: "Input",
                        props: {
                          type: "email",
                          placeholder: "Enter email",
                          value: "@store.state.email",
                          autoBind: "email",
                        },
                        plugins: ["autoBind"],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "Card",
        props: {
          style: {
            marginBottom: "24px",
          },
        },
        children: [
          {
            type: "CardHeader",
            children: [
              {
                type: "CardTitle",
                children: "SetAction Method",
              },
              {
                type: "CardDescription",
                children: "Uses { $action: 'set', path: '...' } syntax",
              },
            ],
          },
          {
            type: "CardContent",
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  },
                },
                children: [
                  {
                    type: "div",
                    children: [
                      {
                        type: "label",
                        props: {
                          style: {
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "500",
                            marginBottom: "8px",
                          },
                        },
                        children: "First Name",
                      },
                      {
                        type: "Input",
                        props: {
                          type: "text",
                          placeholder: "Enter first name",
                          value: "@store.state.firstName",
                          onChange: {
                            $action: "set",
                            path: "/firstName",
                          },
                        },
                      },
                    ],
                  },
                  {
                    type: "div",
                    children: [
                      {
                        type: "label",
                        props: {
                          style: {
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "500",
                            marginBottom: "8px",
                          },
                        },
                        children: "Last Name",
                      },
                      {
                        type: "Input",
                        props: {
                          type: "text",
                          placeholder: "Enter last name",
                          value: "@store.state.lastName",
                          onChange: {
                            $action: "set",
                            path: "lastName",
                          },
                        },
                      },
                    ],
                  },
                  {
                    type: "div",
                    children: [
                      {
                        type: "label",
                        props: {
                          style: {
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "500",
                            marginBottom: "8px",
                          },
                        },
                        children: "Phone",
                      },
                      {
                        type: "Input",
                        props: {
                          type: "tel",
                          placeholder: "Enter phone",
                          value: "@store.state.phone",
                          onChange: {
                            $action: "set",
                            path: "phone",
                          },
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "Card",
        props: {
          style: {
            marginBottom: "24px",
          },
        },
        children: [
          {
            type: "CardHeader",
            children: [
              {
                type: "CardTitle",
                children: "User Information",
              },
              {
                type: "CardDescription",
                children: "Fill out the form below",
              },
            ],
          },
          {
            type: "CardContent",
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  },
                },
                children: [
                  {
                    type: "div",
                    children: [
                      {
                        type: "label",
                        props: {
                          style: {
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "500",
                            marginBottom: "8px",
                          },
                        },
                        children: "Age",
                      },
                      {
                        type: "Input",
                        props: {
                          type: "number",
                          placeholder: "Enter age",
                          value: "@store.state.age",
                          autoBind: "age",
                        },
                        plugins: ["autoBind"],
                      },
                    ],
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      },
                    },
                    children: [
                      {
                        type: "Checkbox",
                        props: {
                          checked: "@store.state.newsletter",
                          autoBind: "newsletter",
                        },
                        plugins: ["autoBind"],
                      },
                      {
                        type: "label",
                        props: {
                          style: {
                            fontSize: "14px",
                          },
                        },
                        children: "Subscribe to newsletter",
                      },
                    ],
                  },
                  {
                    type: "Button",
                    props: {
                      variant: "outline",
                      onClick: "@store.actions.resetForm",
                    },
                    children: "Reset Form",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "Card",
        children: [
          {
            type: "CardHeader",
            children: [
              {
                type: "CardTitle",
                children: "Form State",
              },
              {
                type: "CardDescription",
                children: "Valid: @store.computed.isValid",
              },
            ],
          },
          {
            type: "CardContent",
            children: [
              {
                type: "pre",
                props: {
                  className: "text-justify overflow-auto",
                  style: {
                    backgroundColor: "#f3f4f6",
                    padding: "16px",
                    borderRadius: "8px",
                    fontSize: "12px",
                  },
                },
                children: "@store.computed.formData",
              },
            ],
          },
        ],
      },
    ],
  },
};
