declare module "@/lib/types" {
  export interface ComponentConfigType {
    Store: string;
  }

  export interface ComponentConfig {
    collectionPath?: string;
    subscribe?: boolean;
  }
}

export { Store } from "./Store";
export { useStoreContext } from "./Context";

// type ConfigMap = {
//   Store: {
//     collectionPath: string;
//   };
//   Other: {};
// };

// export type ComponentConfig = {
//   [K in keyof ConfigMap]: { type: K } & ConfigMap[K];
// }[keyof ConfigMap];

// types.ts
// export interface ComponentConfigMap {}

// export type ComponentConfig = {
//   [K in keyof ComponentConfigMap]: {
//     type: K;
//   } & ComponentConfigMap[K];
// }[keyof ComponentConfigMap];

// declare module "@/lib/types" {
//   interface ComponentConfigMap {
//     Store: {
//       collectionPath: string;
//     };
//   }
// }
// declare module "@/lib/types" {
//   interface ComponentConfigMap {
//     Other: {
//       foo: number;
//     };
//   }
// }
