class StatusController {
  constructor() {
    this.enableSync();
  }

  toggle() {
    if (this.enabled) this.disableSync();
    else this.enableSync();
  }

  enableSync() {
    this.enabled = true;
    this.updateInkDropMenuAsync();
  }

  disableSync() {
    this.enabled = false;
    this.updateInkDropMenuAsync();
  }

  updateInkDropMenuAsync() {
    const plugins = inkdrop.menu.template.find((x) => x.label === "Plugins");
    if (!plugins) return;

    const menu = plugins.submenu?.find((x) => x.label === "vim-im-select");
    if (!menu) return;

    const submenu = menu.submenu;
    if (!submenu || submenu.length === 0) return;

    const subsubmenuForEnable = submenu.find(
      (x) => x.label == "Enable vim-im-select",
    );
    const subsubmenuForDisable = submenu.find(
      (x) => x.label == "Disable vim-im-select",
    );

    subsubmenuForEnable.visible = !this.enabled;
    subsubmenuForDisable.visible = this.enabled;

    inkdrop.menu.update();
  }
}

module.exports = StatusController;
