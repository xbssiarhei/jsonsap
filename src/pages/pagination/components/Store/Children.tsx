import { cloneElement } from "react";
import { useStoreContext } from "./Context";

export const StoreChildren = ({ children }) => {
  const { items } = useStoreContext();
  const child = children.props.children;
  const config = child.props.config;

  // return cloneElement(
  //   child,
  //   {
  //     ...child.props,
  //     config: {
  //       ...config,
  //       props: {
  //         ...config.props,
  //         items,
  //       },
  //     },
  //   },
  //   "test",
  // );
  // console.log(child);

  return children;
};
