const fs = require("fs/promises");
const path = require("path");
const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);

class GitHelper {
  constructor(repoUrl, branch = "main", baseDir = __dirname) {
    this.repoUrl = repoUrl;
    this.branch = branch;
    this.repoName = path.basename(repoUrl.replace(/\.git$/, ""));
    this.localDir = path.join(baseDir, this.repoName);
  }

  static async runCmdAsync(cmd, options = {}) {
    const { stdout } = await execAsync(cmd, { encoding: "utf8", ...options });
    return stdout.trim();
  }

  async cloneRepoAsync() {
    try {
      await fs.mkdir(this.localDir, { recursive: true });
      await execAsync(
        `git clone --branch ${this.branch} ${this.repoUrl} ${this.localDir}`,
      );

      await execAsync(
        `git clone --branch "${this.branch}" "${this.repoUrl}" "${this.localDir}"`,
      );
    } catch (err) {
      console.error("[GitHelper] Failed to clone repo:", err);
    }
  }

  async fetchUpdatesAsync() {
    await execAsync("git fetch origin", { cwd: this.localDir });
  }

  async getCurrentCommitAsync() {
    return await GitHelper.runCmdAsync("git rev-parse HEAD", {
      cwd: this.localDir,
    });
  }

  async getRemoteCommitAsync() {
    return await GitHelper.runCmdAsync(`git rev-parse origin/${this.branch}`, {
      cwd: this.localDir,
    });
  }

  async isRepoDirtyAsync() {
    const status = await GitHelper.runCmdAsync("git status --porcelain", {
      cwd: this.localDir,
    });
    return status.length > 0;
  }

  async resetHardAsync() {
    console.log("[GitHelper] Resetting repo to origin...");
    await execAsync(`git reset --hard origin/${this.branch}`, {
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
