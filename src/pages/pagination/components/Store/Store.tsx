import { Children, cloneElement, type ReactElement } from "react";

type StoreProps = {
  className?: string;
  children?: React.ReactNode;
};

export const Store = ({ children, ...props }: StoreProps) => {
  // const { items, snap } = useStoreContext();
  // const child = children.props.children;
  // const config = child.props.config;

  // const newChildren = cloneElement(child, {
  //   ...child.props,
  //   config: {
  //     ...config,
  //     props: {
  //       ...config.props,
  //       items: config.props.items ?? items,
  //       snap,
  //     },
  //   },
  // });

  return Children.map(children, (child: ReactElement<{ config: any }>) => {
    const config = child.props.config;
    return cloneElement(child, {
      ...child.props,
      config: {
        ...config,
        props: {
          ...config.props,
          ...props,
        },
      },
    });
  });

  // return children;
};
