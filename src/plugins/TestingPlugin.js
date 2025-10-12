import { BasePlugin } from "./BasePlugin.js";

export class TestingPlugin extends BasePlugin {
  constructor() {
    super({
      id: "testing",
      name: "Test Runner",
      version: "1.0.0",
      description: "Run and manage tests with Jest/Mocha integration",
      icon: "TestTube",
      category: "testing",
    });

    this.testResults = [];
    this.isRunning = false;
    this.testFramework = "jest"; // or 'mocha'
    this.testFiles = [];
  }

  async activate() {
    await super.activate();
    console.log("Testing plugin activated");
  }

  async runTests(testFiles = []) {
    this.isRunning = true;
    const results = [];

    try {
      for (const testFile of testFiles) {
        const result = await this.runTestFile(testFile);
        results.push(result);
      }

      this.testResults = results;
      return this.generateTestSummary(results);
    } finally {
      this.isRunning = false;
    }
  }

  async runTestFile(testFile) {
    // Simulate test execution delay
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 1000 + 500)
    );

    const tests = this.parseTestFile(testFile);
    const testResults = [];

    for (const test of tests) {
      // Mock test execution with random results
      const passed = Math.random() > 0.2; // 80% pass rate
      const duration = Math.random() * 100 + 10;

      testResults.push({
        name: test.name,
        status: passed ? "passed" : "failed",
        duration: Math.round(duration),
        error: passed ? null : `AssertionError: Expected true but got false`,
        line: test.line,
      });
    }

    return {
      file: testFile.name,
      path: testFile.path,
      tests: testResults,
      passed: testResults.filter((t) => t.status === "passed").length,
      failed: testResults.filter((t) => t.status === "failed").length,
      duration: testResults.reduce((sum, t) => sum + t.duration, 0),
      timestamp: new Date().toISOString(),
    };
  }

  parseTestFile(testFile) {
    const tests = [];
    const lines = testFile.content.split("\n");

    lines.forEach((line, index) => {
      // Look for test patterns
      if (
        line.includes("test(") ||
        line.includes("it(") ||
        line.includes("describe(")
      ) {
        const match = line.match(
          /(?:test|it|describe)\s*\(\s*['"`]([^'"`]+)['"`]/
        );
        if (match) {
          tests.push({
            name: match[1],
            line: index + 1,
            type: line.includes("describe(") ? "suite" : "test",
          });
        }
      }
    });

    return tests;
  }

  generateTestSummary(results) {
    const summary = {
      totalFiles: results.length,
      totalTests: 0,
      passed: 0,
      failed: 0,
      duration: 0,
      coverage: Math.random() * 30 + 70,
      timestamp: new Date().toISOString(),
    };

    results.forEach((result) => {
      summary.totalTests += result.tests.length;
      summary.passed += result.passed;
      summary.failed += result.failed;
      summary.duration += result.duration;
    });

    summary.passRate =
      summary.totalTests > 0
        ? Math.round((summary.passed / summary.totalTests) * 100)
        : 0;

    return summary;
  }

  getTestStats() {
    if (this.testResults.length === 0) {
      return null;
    }

    return this.generateTestSummary(this.testResults);
  }

  async findTestFiles() {
    const mockTestFiles = [
      {
        name: "App.test.js",
        path: "/src/App.test.js",
        content: `
test('renders learn react link', () => {
  expect(true).toBe(true);
});

test('handles user input', () => {
  expect(false).toBe(false);
});
        `,
      },
      {
        name: "utils.test.js",
        path: "/src/utils/utils.test.js",
        content: `
describe('utility functions', () => {
  test('should format date correctly', () => {
    expect(true).toBe(true);
  });
  
  test('should validate email', () => {
    expect(true).toBe(true);
  });
});
        `,
      },
    ];

    this.testFiles = mockTestFiles;
    return mockTestFiles;
  }

  setFramework(framework) {
    if (["jest", "mocha", "vitest"].includes(framework)) {
      this.testFramework = framework;
      this.updateSettings({ testFramework: framework });
    }
  }

  clearResults() {
    this.testResults = [];
  }

  async executeAction(action, payload) {
    switch (action) {
      case "runTests":
        return await this.runTests(payload.files || this.testFiles);

      case "runTestFile":
        return await this.runTestFile(payload.file);

      case "findTestFiles":
        return await this.findTestFiles();

      case "getStats":
        return this.getTestStats();

      case "setFramework":
        this.setFramework(payload.framework);
        return { success: true };

      case "clearResults":
        this.clearResults();
        return { success: true };

      default:
        return await super.executeAction(action, payload);
    }
  }
}
