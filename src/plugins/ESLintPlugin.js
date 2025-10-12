import { BasePlugin } from "./BasePlugin.js";

export class ESLintPlugin extends BasePlugin {
  constructor() {
    super({
      id: "eslint",
      name: "ESLint Integration",
      version: "1.0.0",
      description: "Real-time code linting and quality analysis",
      icon: "AlertTriangle",
      category: "code-quality",
    });

    this.lintResults = [];
    this.isLinting = false;
    this.lintRules = {
      "no-unused-vars": "error",
      "no-console": "warn",
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: "error",
      curly: "error",
    };
  }

  async activate() {
    await super.activate();
    console.log("ESLint plugin activated");
  }

  lintCode(code, filename = "untitled.js") {
    const issues = [];
    const lines = code.split("\n");

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      if (line.includes("console.log") && this.lintRules["no-console"]) {
        issues.push({
          line: lineNumber,
          column: line.indexOf("console.log") + 1,
          message: "Unexpected console statement",
          severity:
            this.lintRules["no-console"] === "error" ? "error" : "warning",
          rule: "no-console",
        });
      }

      if (line.includes("var ") && this.lintRules["no-var"]) {
        issues.push({
          line: lineNumber,
          column: line.indexOf("var ") + 1,
          message: "Unexpected var, use let or const instead",
          severity: "error",
          rule: "no-var",
        });
      }

      if (
        line.includes("==") &&
        !line.includes("===") &&
        !line.includes("!==") &&
        this.lintRules["eqeqeq"]
      ) {
        issues.push({
          line: lineNumber,
          column: line.indexOf("==") + 1,
          message: "Expected === and instead saw ==",
          severity: "error",
          rule: "eqeqeq",
        });
      }

      // Check for missing curly braces
      if (
        (line.includes("if ") ||
          line.includes("for ") ||
          line.includes("while ")) &&
        !line.includes("{") &&
        this.lintRules["curly"]
      ) {
        issues.push({
          line: lineNumber,
          column: 1,
          message: "Expected { after control statement",
          severity: "error",
          rule: "curly",
        });
      }
    });

    return {
      filename,
      issues,
      errorCount: issues.filter((i) => i.severity === "error").length,
      warningCount: issues.filter((i) => i.severity === "warning").length,
      timestamp: new Date().toISOString(),
    };
  }

  async lintFiles(files) {
    this.isLinting = true;
    const results = [];

    try {
      for (const file of files) {
        const result = this.lintCode(file.content, file.name);
        results.push(result);
      }

      this.lintResults = results;
      return results;
    } finally {
      this.isLinting = false;
    }
  }

  getLintStats() {
    const stats = {
      totalFiles: this.lintResults.length,
      totalIssues: 0,
      totalErrors: 0,
      totalWarnings: 0,
      ruleBreakdown: {},
    };

    this.lintResults.forEach((result) => {
      stats.totalIssues += result.issues.length;
      stats.totalErrors += result.errorCount;
      stats.totalWarnings += result.warningCount;

      result.issues.forEach((issue) => {
        if (!stats.ruleBreakdown[issue.rule]) {
          stats.ruleBreakdown[issue.rule] = 0;
        }
        stats.ruleBreakdown[issue.rule]++;
      });
    });

    return stats;
  }

  updateRules(newRules) {
    this.lintRules = { ...this.lintRules, ...newRules };
    this.updateSettings({ lintRules: this.lintRules });
  }

  getRules() {
    return this.lintRules;
  }

  clearResults() {
    this.lintResults = [];
  }

  async executeAction(action, payload) {
    switch (action) {
      case "lintCode":
        return this.lintCode(payload.code, payload.filename);

      case "lintFiles":
        return await this.lintFiles(payload.files);

      case "getStats":
        return this.getLintStats();

      case "updateRules":
        this.updateRules(payload.rules);
        return { success: true };

      case "getRules":
        return this.getRules();

      case "clearResults":
        this.clearResults();
        return { success: true };

      default:
        return await super.executeAction(action, payload);
    }
  }
}
