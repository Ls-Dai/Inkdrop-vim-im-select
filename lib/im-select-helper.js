const fs = require("fs/promises");
const path = require("path");
const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);

const GitHelper = require("./git-helper");

class ImSelectHelper {
  constructor() {
    this.repoUrl = "https://github.com/daipeihust/im-select.git";
    this.branch = "master";
    this.vendorDir = path.resolve(__dirname, "../vendor");

    this.gitHelper = new GitHelper(this.repoUrl, this.branch, this.vendorDir);
    this.execPath = path.join(
      this.vendorDir,
      "im-select/macOS/out/apple/im-select",
    );
  }

  async setupAsync() {
    try {
      await fs.access(this.gitHelper.localDir);
      await this.gitHelper.ensureUpToDateAsync();
    } catch (e) {
      await fs.rm(this.vendorDir, { recursive: true, force: true });
      await this.gitHelper.cloneRepoAsync();
    }

    const execAvailable = await this.checkExecAvailableAsync();
    return execAvailable ? this.execPath : null;
  }

  async checkExecAvailableAsync() {
    try {
      await fs.access(this.execPath, fs.constants.F_OK | fs.constants.X_OK);
      return true;
    } catch (err) {
      console.error(
        "Executable does NOT exist or is not accessible:",
        err.message,
      );
      return false;
    }
  }

  async getCurrentInputSourceAsync() {
    try {
      const { stdout } = await execAsync(this.execPath);
      return stdout.trim();
    } catch (err) {
      return "Error: " + err.message;
    }
  }

  async setCurrentInputSourceAsync(inputSource) {
    try {
      await execAsync(`${this.execPath} ${inputSource}`);
    } catch (err) {
      console.error("Failed to set input source:", err.message);
    }
  }
}

module.exports = ImSelectHelper;
