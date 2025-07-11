# vim-im-select for Inkdrop

> ✨ **Improve Inkdrop's Vim mode experience with automatic input method switching.**
> Inspired by [vim-im-select](https://github.com/daipeihust/im-select)

---

### 🧠 What This Plugin Does

This Inkdrop plugin improves the experience of using Vim mode (`inkdrop-vim`) with multilingual input methods (IMEs), by automatically switching between your default input method and your previously used one.

It mimics key behaviors from `vim-im-select`, adapted for Inkdrop:

* 📝 Switch to **default IM** when entering Normal mode
* 🔤 Switch back to **previous IM** when entering Insert mode
* 🪟 On app focus:

  * If currently in Normal mode: switch to default IM
  * Otherwise: do nothing
* 🎯 On app blur:

  * If currently in Normal mode: restore previous IM
  * Otherwise: do nothing

---

### 🧩 Requirements

* macOS with [`im-select`](https://github.com/daipeihust/im-select) installed
* [`inkdrop-vim`](https://github.com/inkdropapp/inkdrop-vim) enabled
* Node.js bindings to system input source (this plugin uses `im-select` under the hood)

Linux and Windows support is theoretically possible if `im-select` or an equivalent is present and accessible.

---

### 🔧 Configuration (Coming Soon)

Currently, the plugin uses `im-select` with hardcoded default and last input methods. Future versions may support:

* Custom default IM key
* Custom path to `im-select`
* Focus event toggle
* Timeout protection (avoid flicker when IM switching triggers extra focus events)

---

### 📦 Installation

1. Install [`im-select`](https://github.com/daipeihust/im-select)

   ```bash
   brew install im-select
   ```

2. In Inkdrop, go to `Preferences → Plugins → Install Plugin` and search for:

   ```
   vim-im-select
   ```

---

### 🖱️ Commands

The plugin adds two commands to Inkdrop’s command palette:

* `vim-im-select:enable` — Enable IM auto-switching
* `vim-im-select:disable` — Disable IM auto-switching

You can also toggle from the menu:
**Plugins → vim-im-select → Enable/Disable vim-im-select**

---

### 🤝 Credit

This plugin is heavily inspired by [vim-im-select](https://github.com/daipeihust/im-select), which provides a fantastic IM switching experience in Neovim and Vim.

Original plugin authored by [daipeihust](https://github.com/daipeihust).
We just adapted the idea to Inkdrop's React + Electron environment.

---

### 📄 License

MIT

---

如果你愿意，我们还可以加：

* GIF 预览动图（展示自动切换 IM 效果）
* Mac 下 `im-select` 安装问题 FAQ（常见权限、PATH 问题）
* 插件开发者名字或链接

你可以将这个 `README.md` 直接作为插件根目录的 README 文件，或发布到 npm/github。需要我自动帮你生成 demo 图、插件徽章等，可以随时说！
