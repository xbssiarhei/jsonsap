import { pluginRegistry } from "./plugins";
import { autoBindPlugin } from "./plugins/autoBind";
import { repeaterPlugin } from "./plugins/repeater";
import { paginationPlugin } from "./plugins/pagination";

/**
 * Register all common plugins globally
 *
 * These plugins are available across the entire application.
 * Page-specific plugins (logger, wrapper) should be registered locally in their respective pages.
 *
 * Common plugins:
 * - autoBind: Automatic form input binding to store state
 * - repeater: Context provider for Repeater2 component
 * - pagination: Adds pagination to StoreCollection component
 *
 * Note: modifiers2 is not a plugin - it's applied via applyModifiers2() function in renderer
 */
export function registerCommonPlugins() {
  pluginRegistry.register(autoBindPlugin);
  pluginRegistry.register(repeaterPlugin);
  pluginRegistry.register(paginationPlugin);
}
