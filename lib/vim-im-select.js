"use babel";

import VimModeInputSwitcher from "./vim-mode-input-switcher";

module.exports = {
  activate() {
    inkdrop.components.registerClass(VimModeInputSwitcher);
    inkdrop.layouts.addComponentToLayout("modal", "VimModeInputSwitcher");
  },

  deactivate() {
    inkdrop.layouts.removeComponentFromLayout("modal", "VimModeInputSwitcher");
    inkdrop.components.deleteClass(VimModeInputSwitcher);
  },
};
