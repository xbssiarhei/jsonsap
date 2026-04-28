import { componentRegistry, pluginRegistry } from "@/lib";
import { Store } from "./Store";
import { Items } from "./Items";
import { Item } from "./Item";
import { PaginationControl, paginationPlugin2 } from "./Pagination";
import { storePlugin } from "./Store/plugin";
import { Views } from "./Views";
import { viewsPlugin } from "./Views/plugin";
import { TableView } from "./Table";

componentRegistry.register("Store", Store, {
  requiredPlugins: ["store"],
});
componentRegistry.register("Items", Items);
componentRegistry.register("Item", Item);
componentRegistry.register("PaginationControl", PaginationControl);
componentRegistry.register("TableView", TableView);
componentRegistry.register("Views", Views, {
  requiredPlugins: ["views"],
});

pluginRegistry.register(paginationPlugin2);
pluginRegistry.register(storePlugin);
pluginRegistry.register(viewsPlugin);
