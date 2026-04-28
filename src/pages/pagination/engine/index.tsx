import { cn } from "@/lib/utils";
import type { FC } from "react";

const Div = (props) => {
  return <div {...props} />;
};

const List = (props) => {
  return (
    <div>
      List
      <div {...props} />
    </div>
  );
};

const Text = (props) => {
  return <span {...props} />;
};

const Avatar = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-full size-6 bg-accent flex justify-center items-center",
        className,
      )}
      {...props}
    ></div>
  );
};

const Components = {
  Div,
  List,
  Text,
  Avatar,
};

type Config = {
  type: string;
  label?: string;
  children?: Config[] | string;
  plugins?: any[];
  modifiers?: any[];
  props?: any;
};

const withEngine = (Component, config: Config) => {
  console.log("wrapComponent", config.type);

  return ({ elements }) => {
    console.log("beforeRender", config.type, config.label, elements);

    const element = (
      <Component {...config.props}>
        {typeof elements === "string"
          ? elements
          : elements?.map((Child, index) => <Child key={index} />)}
      </Component>
    );

    console.log("afterRender", config.type);

    return element;
  };
};

const getComponent = (config: Config) => {
  const Component = Components[config.type];

  if (!Component) {
    return () => "None";
  }

  return withEngine(Component, config);
};

const parseConfig = (config: Config): FC => {
  const Component = getComponent(config);

  return Component;
};

const config: Config = {
  type: "Div",
  label: "Root",
  props: {
    className: "w-40",
  },
  children: [
    {
      type: "List",
      label: "List",
      props: {
        className: "flex justify-between items-center p-4",
      },
      modifiers: [],
      children: [
        {
          type: "Div",
          props: {
            className: "flex gap-4 items-center",
          },
          children: [
            {
              type: "Avatar",
              plugins: [
                {
                  type: "modifier",
                  items: [{}],
                },
              ],
              children: "T",
            },
            { type: "Text", children: "Hello" },
            { type: "Text", children: "World" },
          ],
        },
      ],
    },
  ],
};

const getComponents = (config: Config) => {
  const result = {
    component: parseConfig(config),
    type: config.type,
    children: undefined,
  };
  if (config.children) {
    if (typeof config.children === "string") {
      result.children = config.children;
    } else {
      result.children = config.children.map(getComponents);
    }
  }

  return (props) => {
    console.log(props, result);

    const Component = result.component;
    return <Component elements={result.children} {...props} />;
  };
};

export const RootEngine = () => {
  const Root = getComponents(config);

  return (
    <div>
      root
      <Root />
      {/* <Start /> */}
    </div>
  );
};
