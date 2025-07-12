const fs = require("fs/promises");
const path = require("path");
const { spawn } = require("child_process");

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
    if (!this.execPath) return "Error: execPath not set";

    return new Promise((resolve, reject) => {
      const proc = spawn(this.execPath, []);
      let stdout = "";
      let stderr = "";

      proc.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      proc.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      proc.on("close", (code) => {
        if (code === 0) {
          resolve(stdout.trim());
        } else {
          reject(`im-select exited with code ${code}: ${stderr}`);
        }
      });

      proc.on("error", (err) => {
        reject(`spawn error: ${err.message}`);
      });
    });
  }

  async setCurrentInputSourceAsync(inputSource) {
    if (!this.execPath) {
      console.warn("execPath is not set. Skipping input source switch.");
      return;
    }

    return new Promise((resolve, reject) => {
      const proc = spawn(this.execPath, [inputSource]);
      let stderr = "";

      proc.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      proc.on("close", (code) => {
        if (code === 0) resolve();
        else {
          console.error("im-select set failed:", stderr);
          reject(new Error(stderr));
        }
      });

      proc.on("error", (err) => {
        console.error("spawn error when setting input source:", err);
        reject(err);
      });
    });
  }
}

module.exports = ImSelectHelper;
