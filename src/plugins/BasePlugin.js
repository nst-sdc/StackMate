export class BasePlugin {
  constructor(config = {}) {
    this.id = config.id;
    this.name = config.name;
    this.version = config.version || "1.0.0";
    this.description = config.description || "";
    this.icon = config.icon;
    this.category = config.category || "general";
    this.settings = config.settings || {};
    this.isActive = false;
  }

  async activate() {
    this.isActive = true;
    console.log(`${this.name} plugin activated`);
  }

  async deactivate() {
    this.isActive = false;
    console.log(`${this.name} plugin deactivated`);
  }

  getInfo() {
    return {
      id: this.id,
      name: this.name,
      version: this.version,
      description: this.description,
      icon: this.icon,
      category: this.category,
      isActive: this.isActive,
    };
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
  }

  getSettings() {
    return this.settings;
  }

  renderUI() {
    return null;
  }

  async executeAction(action, payload) {
    console.log(`Executing action ${action} on plugin ${this.name}`);
    return null;
  }
}
