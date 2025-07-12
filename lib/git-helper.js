const fs = require("fs/promises");
const path = require("path");
const { spawn } = require("child_process");

class GitHelper {
  constructor(repoUrl, branch = "main", baseDir = __dirname) {
    this.repoUrl = repoUrl;
    this.branch = branch;
    this.repoName = path.basename(repoUrl.replace(/\.git$/, ""));
    this.localDir = path.join(baseDir, this.repoName);
  }

  static runSpawnAsync(command, args, options = {}) {
    return new Promise((resolve, reject) => {
      const proc = spawn(command, args, {
        stdio: "pipe",
        ...options,
      });

      let stdout = "";
      let stderr = "";

      proc.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      proc.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      proc.on("close", (code) => {
        if (code === 0) resolve(stdout.trim());
        else reject(new Error(stderr || `Command failed with code ${code}`));
      });
    });
  }

  async cloneRepoAsync() {
    try {
      await fs.mkdir(this.localDir, { recursive: true });

      await GitHelper.runSpawnAsync("git", [
        "clone",
        "--branch",
        this.branch,
        this.repoUrl,
        this.localDir,
      ]);
    } catch (err) {
      console.error("[GitHelper] Failed to clone repo:", err);
    }
  }

  async fetchUpdatesAsync() {
    await GitHelper.runSpawnAsync("git", ["fetch", "origin"], {
      cwd: this.localDir,
    });
  }

  async getCurrentCommitAsync() {
    return await GitHelper.runSpawnAsync("git", ["rev-parse", "HEAD"], {
      cwd: this.localDir,
    });
  }

  async getRemoteCommitAsync() {
    return await GitHelper.runSpawnAsync("git", ["rev-parse", `origin/${this.branch}`], {
      cwd: this.localDir,
    });
  }

  async isRepoDirtyAsync() {
    const status = await GitHelper.runSpawnAsync("git", ["status", "--porcelain"], {
      cwd: this.localDir,
    });
    return status.length > 0;
  }

  async resetHardAsync() {
    console.log("[GitHelper] Resetting repo to origin...");
    await GitHelper.runSpawnAsync("git", ["reset", "--hard", `origin/${this.branch}`], {
      cwd: this.localDir,
    });
  }

  async ensureUpToDateAsync() {
    await this.fetchUpdatesAsync();
    const [local, remote, dirty] = await Promise.all([
      this.getCurrentCommitAsync(),
      this.getRemoteCommitAsync(),
      this.isRepoDirtyAsync(),
    ]);
    if (local !== remote || dirty) {
      await this.resetHardAsync();
    }
  }
}

module.exports = GitHelper;