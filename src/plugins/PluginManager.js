class PluginManager {
  constructor() {
    this.plugins = new Map();
    this.activePlugins = new Set();
    this.eventListeners = new Map();
  }

  registerPlugin(plugin) {
    if (!plugin.id || !plugin.name) {
      throw new Error("Plugin must have id and name properties");
    }

    plugin.status = "registered";
    plugin.lastUpdated = new Date();
    this.plugins.set(plugin.id, plugin);

    console.log(`Plugin registered: ${plugin.name}`);
    return true;
  }

  async activatePlugin(pluginId) {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    try {
      if (plugin.activate) {
        await plugin.activate();
      }

      plugin.status = "active";
      this.activePlugins.add(pluginId);
      this.emit("pluginActivated", { pluginId, plugin });

      console.log(`Plugin activated: ${plugin.name}`);
      return true;
    } catch (error) {
      plugin.status = "error";
      plugin.error = error.message;
      console.error(`Failed to activate plugin ${plugin.name}:`, error);
      throw error;
    }
  }

  async deactivatePlugin(pluginId) {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return false;

    try {
      if (plugin.deactivate) {
        await plugin.deactivate();
      }

      plugin.status = "inactive";
      this.activePlugins.delete(pluginId);
      this.emit("pluginDeactivated", { pluginId, plugin });

      console.log(`Plugin deactivated: ${plugin.name}`);
      return true;
    } catch (error) {
      console.error(`Failed to deactivate plugin ${plugin.name}:`, error);
      throw error;
    }
  }

  getAllPlugins() {
    return Array.from(this.plugins.values());
  }

  getActivePlugins() {
    return Array.from(this.activePlugins)
      .map((id) => this.plugins.get(id))
      .filter(Boolean);
  }

  getPlugin(pluginId) {
    const plugin = this.plugins.get(pluginId);
    console.log(`Getting plugin ${pluginId}:`, plugin);
    console.log(`Plugin prototype:`, Object.getPrototypeOf(plugin));
    console.log(
      `Plugin methods:`,
      Object.getOwnPropertyNames(Object.getPrototypeOf(plugin))
    );
    console.log(`Plugin has executeAction:`, typeof plugin?.executeAction);
    if (plugin && typeof plugin.executeAction === "function") {
      console.log("executeAction method found!");
    } else {
      console.log("executeAction method NOT found!");
    }
    return plugin;
  }

  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  emit(event, data) {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }

  async executePluginMethod(methodName, ...args) {
    const results = [];

    for (const pluginId of this.activePlugins) {
      const plugin = this.plugins.get(pluginId);
      if (plugin && typeof plugin[methodName] === "function") {
        try {
          const result = await plugin[methodName](...args);
          results.push({ pluginId, result });
        } catch (error) {
          console.error(
            `Error executing ${methodName} on plugin ${plugin.name}:`,
            error
          );
          results.push({ pluginId, error: error.message });
        }
      }
    }

    return results;
  }
}

const pluginManager = new PluginManager();

export default pluginManager;
