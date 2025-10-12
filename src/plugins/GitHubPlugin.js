import { BasePlugin } from "./BasePlugin.js";
import { Octokit } from "@octokit/rest";

export class GitHubPlugin extends BasePlugin {
  constructor() {
    super({
      id: "github",
      name: "GitHub Integration",
      version: "1.0.0",
      description: "Access GitHub commits, issues, and repository data",
      icon: "Github",
      category: "version-control",
    });

    this.octokit = null;
    this.currentRepo = null;
    this.cache = new Map();
  }

  async activate() {
    await super.activate();

    try {
      this.octokit = new Octokit({
        auth: this.settings.token || undefined,
      });
    } catch (error) {
      console.log("GitHub plugin activated in offline mode");
    }
  }

  setToken(token) {
    this.updateSettings({ token });
    this.octokit = new Octokit({ auth: token });
  }

  setRepository(owner, repo) {
    this.currentRepo = { owner, repo };
    this.updateSettings({ currentRepo: this.currentRepo });
  }

  async getRepository(owner, repo) {
    const key = `repo-${owner}-${repo}`;

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    try {
      const { data } = await this.octokit.rest.repos.get({
        owner,
        repo,
      });

      this.cache.set(key, data);
      return data;
    } catch (error) {
      console.error("Error fetching repository:", error);
      throw error;
    }
  }

  async getCommits(owner, repo, options = {}) {
    const key = `commits-${owner}-${repo}-${JSON.stringify(options)}`;

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    try {
      if (!this.octokit) {
        return this.getMockCommits();
      }

      const { data } = await this.octokit.rest.repos.listCommits({
        owner,
        repo,
        per_page: options.limit || 10,
        since: options.since,
        until: options.until,
        ...options,
      });

      this.cache.set(key, data);
      return data;
    } catch (error) {
      console.error("Error fetching commits, using mock data:", error);
      return this.getMockCommits();
    }
  }

  getMockCommits() {
    return [
      {
        commit: {
          message: "Fix plugin system integration",
          author: { name: "Developer", date: new Date().toISOString() },
        },
      },
      {
        commit: {
          message: "Add ESLint support",
          author: { name: "Developer", date: new Date().toISOString() },
        },
      },
      {
        commit: {
          message: "Update testing framework",
          author: { name: "Developer", date: new Date().toISOString() },
        },
      },
    ];
  }

  getMockIssues() {
    return [
      {
        title: "Plugin system not loading",
        number: 123,
        state: "open",
      },
      {
        title: "ESLint integration needed",
        number: 124,
        state: "closed",
      },
    ];
  }

  async getIssues(owner, repo, options = {}) {
    try {
      if (!this.octokit) {
        return this.getMockIssues();
      }

      const { data } = await this.octokit.rest.issues.listForRepo({
        owner,
        repo,
        state: options.state || "open",
        per_page: options.limit || 10,
        ...options,
      });

      return data;
    } catch (error) {
      console.error("Error fetching issues, using mock data:", error);
      return this.getMockIssues();
    }
  }

  async getPullRequests(owner, repo, options = {}) {
    try {
      const { data } = await this.octokit.rest.pulls.list({
        owner,
        repo,
        state: options.state || "open",
        per_page: options.limit || 10,
        ...options,
      });

      return data;
    } catch (error) {
      console.error("Error fetching pull requests:", error);
      throw error;
    }
  }

  async getBranches(owner, repo) {
    try {
      const { data } = await this.octokit.rest.repos.listBranches({
        owner,
        repo,
      });

      return data;
    } catch (error) {
      console.error("Error fetching branches:", error);
      throw error;
    }
  }

  async searchRepositories(query, options = {}) {
    try {
      const { data } = await this.octokit.rest.search.repos({
        q: query,
        per_page: options.limit || 10,
        sort: options.sort || "stars",
        order: options.order || "desc",
      });

      return data.items;
    } catch (error) {
      console.error("Error searching repositories:", error);
      throw error;
    }
  }

  clearCache() {
    this.cache.clear();
  }

  async executeAction(action, payload) {
    switch (action) {
      case "setToken":
        this.setToken(payload.token);
        return { success: true };

      case "setRepo":
        this.setRepository(payload.owner, payload.repo);
        return { success: true };

      case "getCommits":
        return await this.getCommits(
          payload.owner || this.currentRepo?.owner,
          payload.repo || this.currentRepo?.repo,
          payload.options
        );

      case "getIssues":
        return await this.getIssues(
          payload.owner || this.currentRepo?.owner,
          payload.repo || this.currentRepo?.repo,
          payload.options
        );

      case "getPullRequests":
        return await this.getPullRequests(
          payload.owner || this.currentRepo?.owner,
          payload.repo || this.currentRepo?.repo,
          payload.options
        );

      case "searchRepos":
        return await this.searchRepositories(payload.query, payload.options);

      case "clearCache":
        this.clearCache();
        return { success: true };

      default:
        return await super.executeAction(action, payload);
    }
  }
}
