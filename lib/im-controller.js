const { spawn } = require("child_process");

const ImSelectHelper = require("./im-select-helper");

class InputMethodController {
  constructor() {
    this.platform = process.platform;
    this.prevInputSource = null;

    this.imSelectHelper = null;
    this.imSelectPath = null;
  }

  async initAsync() {
    if (this.platform !== "darwin") {
      console.warn("InputSourceManager currently supports only macOS");
      return;
    }

    this.imSelectHelper = new ImSelectHelper();
    this.imSelectPath = await this.imSelectHelper.setupAsync();
    this.prevInputSource =
      await this.imSelectHelper.getCurrentInputSourceAsync();
  }

  async switchByInputSourceAsync(inputSource) {
    if (!this.imSelectPath) {
      console.warn("[im-select] imSelectPath not set, skipping switch.");
      return;
    }
    return new Promise((resolve, reject) => {
      const proc = spawn(this.imSelectPath, [inputSource]);

      let stderr = "";

      proc.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      proc.on("close", (code) => {
        if (code === 0) resolve();
        else {
          console.error("im-select failed:", stderr);
          reject(new Error(stderr));
        }
      });

      proc.on("error", (err) => {
        console.error("Failed to spawn im-select:", err);
        reject(err);
      });
    });
  }

  async switchAsync() {
    const currInputSource =
      await this.imSelectHelper.getCurrentInputSourceAsync();
    if (currInputSource != this.prevInputSource)
      this.switchByInputSourceAsync(this.prevInputSource);
    this.prevInputSource = currInputSource;
  }
}

module.exports = InputMethodController;
