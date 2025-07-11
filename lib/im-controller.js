const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);

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
    try {
      await execAsync(`${this.imSelectPath} ${inputSource}`);
    } catch (e) {
      console.error("Failed to switch input method to", inputSource, e);
    }
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
