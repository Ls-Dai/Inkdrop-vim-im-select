# vim-im-select for Inkdrop

> ✨ **Seamlessly switch input methods in Inkdrop's Vim mode.**
> Inspired by [vim-im-select](https://github.com/daipeihust/im-select) and [im-select](https://github.com/daipeihust/im-select)

### 🧠 What It Does

This plugin enhances the Vim mode (`inkdrop-vim`) experience in Inkdrop by automatically switching your input method (IME) when entering or leaving Insert Mode.

Without it, users typing in a non-English IME must manually switch to English when entering Normal Mode, and then switch back when re-entering Insert Mode. This can interrupt your workflow.

With `vim-im-select`, the plugin automatically:

* Switches to English when you enter Normal Mode
* Restores your previous IME when you return to Insert Mode

No more manual toggling—just focus on writing and editing.

### 🧩 Requirements

* **MacOS with Apple Silicon (M series)**
  (Support for Intel Macs and Windows is planned—`im-select` already supports them.)

### 📦 Installation & Setup

No need to install `im-select` manually.
This plugin will automatically download and manage a copy for local use.

### 🖱️ Commands

Once installed, you’ll find a new command in the Inkdrop command palette:

* `vim-im-select:toggle` — Enable or disable automatic IM switching

You can also toggle from the menu:
**Plugins → vim-im-select → Enable/Disable**

### 🤝 Credits

Inspired by [vim-im-select](https://github.com/daipeihust/im-select) by [daipeihust](https://github.com/daipeihust), which provides excellent IME switching in Vim/Neovim.

This version is adapted for Inkdrop’s React + Electron environment.

### 📄 License

MIT