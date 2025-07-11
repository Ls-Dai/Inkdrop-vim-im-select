"use babel";

import VimImSelect from "./vim-im-select";

module.exports = {
  activate() {
    inkdrop.components.registerClass(VimImSelect);
    inkdrop.layouts.addComponentToLayout("modal", "VimImSelect");
  },

  deactivate() {
    inkdrop.layouts.removeComponentFromLayout("modal", "VimImSelect");
    inkdrop.components.deleteClass(VimImSelect);
  },
};
