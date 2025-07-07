"use babel";

import React, { useEffect, useCallback, useRef } from "react";
import { logger } from "inkdrop";
import PluginStatusController from "./plugin-status-controller";
const InputSourceManager = require("./inputsource-manager");

const VimModeInputSwitcher = () => {
  const inputSourceManager = useRef(null);
  const currentMode = useRef("");
  const pluginStatusController = useRef(new PluginStatusController());

  const onNormalMode = useCallback(async () => {
    if (!inputSourceManager.current) return;
    await inputSourceManager.current.switchToDefaultAsync();
    logger.debug("Switch to the default input source.");
  }, []);

  const onInsertMode = useCallback(async () => {
    if (!inputSourceManager.current) return;
    await inputSourceManager.current.switchBackAsync();
    logger.debug("Switch to the previous input source.");
  }, []);

  useEffect(() => {
    let cancelled = false;

    const setup = async () => {
      const manager = new InputSourceManager();
      await manager.initAsync();
      if (cancelled) return;
      inputSourceManager.current = manager;

      const editor = inkdrop.getActiveEditor();
      if (!editor) return;

      const { cm } = editor;

      const observer = ({ mode }) => {
        if (pluginStatusController.current.enabled === false) return;
        if (mode === currentMode.current) return;
        currentMode.current = mode;

        logger.debug("[vim-im-select] Mode Changed To:", mode);

        if (mode === "insert") {
          onInsertMode();
        } else if (mode === "normal") {
          onNormalMode();
        }
      };

      cm.on("vim-mode-change", observer);

      return () => {
        cm.off("vim-mode-change", observer);
      };
    };

    const sub = inkdrop.commands.add(document.body, {
      "vim-im-select:toggle": () => {
        pluginStatusController.current.toggle();
      },
    });

    setup();

    return () => {
      cancelled = true;
      sub.dispose();
    };
  }, [onInsertMode, onNormalMode]);

  return null;
};

export default VimModeInputSwitcher;
