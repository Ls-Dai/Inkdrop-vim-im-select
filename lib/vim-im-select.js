"use babel";

import { useEffect, useCallback, useRef } from "react";
import { logger } from "inkdrop";
import StatusController from "./status-controller";
const InputMethodController = require("./im-controller");

const VimImSelect = () => {
  const inputMethodController = useRef(null);
  const currentMode = useRef("");
  const statusController = useRef(new StatusController());

  const onNormalMode = useCallback(async () => {
    if (!inputMethodController.current) return;
    await inputMethodController.current.switchAsync();
    logger.debug("Switch to the default input source.");
  }, []);

  const onInsertMode = useCallback(async () => {
    if (!inputMethodController.current) return;
    await inputMethodController.current.switchAsync();
    logger.debug("Switch to the previous input source.");
  }, []);

  useEffect(() => {
    let cancelled = false;

    const setup = async () => {
      const controller = new InputMethodController();
      await controller.initAsync();
      if (cancelled) return;
      inputMethodController.current = controller;

      const editor = inkdrop.getActiveEditor();
      if (!editor) return;

      const { cm } = editor;

      const observer = ({ mode }) => {
        if (statusController.current.enabled === false) return;
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
        statusController.current.toggle();
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

export default VimImSelect;
