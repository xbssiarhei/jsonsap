import { componentRegistry } from "@/lib";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import * as Item from "@/components/ui/item";
import * as Tabs from "@/components/ui/tabs";
import * as Avatar from "@/components/ui/avatar";

// type Item = typeof Item;
type ItemKeys = keyof typeof Item;
type ItemMapComponents = {
  // [K in ItemKeys as `Item.${K}`]: string;
  [K in ItemKeys]: string;
};

componentRegistry.register("AppSidebar", AppSidebar);
componentRegistry.register("SidebarProvider", SidebarProvider);
componentRegistry.registerMany("Item", Item);
componentRegistry.registerMany("", Item);
componentRegistry.registerMany("", Tabs);
componentRegistry.registerMany("", Avatar);

declare module "@/lib/types" {
  export interface ComponentConfigType extends ItemMapComponents {
    AppSidebar: string;
    SidebarProvider: string;
  }
}
