class PluginStatusController {
  constructor() {
    this.enableSync();
  }

  toggle() {
    if (this.enabled) this.disableSync();
    else this.enableSync();
  }

  enableSync() {
    this.enabled = true;
    this.setInkDropMenuAsync();
  }

  disableSync() {
    this.enabled = false;
    this.setInkDropMenuAsync();
  }

  setInkDropMenuAsync() {
    const submenuDescription = this.enabled
      ? "Disable vim-im-select"
      : "Enable vim-im-select";

    const plugins = inkdrop.menu.template.find((x) => x.label === "Plugins");
    if (!plugins) return;

    const menu = plugins.submenu?.find((x) => x.label === "vim-im-select");
    if (!menu) return;

    const submenu = menu.submenu;
    if (!submenu || submenu.length === 0) return;

    submenu[0].label = submenuDescription;

    inkdrop.menu.update();
  }
}

module.exports = PluginStatusController;
