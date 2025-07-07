const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);

const ImSelectHelper = require("./im-select-helper");

class InputSourceManager {
  constructor() {
    this.platform = process.platform;
    this.prevInputSource = null;
    this.defaultInputSource = "com.apple.keylayout.US";

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
  }

  async switchInputSourceAsync(inputSource) {
    try {
      await execAsync(`${this.imSelectPath} ${inputSource}`);
    } catch (e) {
      console.error("Failed to switch input method to", inputSource, e);
    }
  }

  async switchToDefaultAsync() {
    const currInputSource =
      await this.imSelectHelper.getCurrentInputSourceAsync();
    if (currInputSource !== this.defaultInputSource) {
      await this.switchInputSourceAsync(this.defaultInputSource);
    }
    this.prevInputSource = currInputSource;
    return this.defaultInputSource;
  }

  async switchBackAsync() {
    if (this.prevInputSource === null) return this.defaultInputSource;
    await this.switchInputSourceAsync(this.prevInputSource);
    return this.prevInputSource;
  }
}

module.exports = InputSourceManager;
