export const pluginConfig = {
  github: {
    defaultSettings: {
      token: "",
      currentRepo: null,
      cacheTimeout: 300000,
      maxCommits: 50,
      maxIssues: 50,
    },
    apiEndpoints: {
      base: "https://api.github.com",
      repos: "/repos",
      commits: "/commits",
      issues: "/issues",
      pulls: "/pulls",
    },
  },

  eslint: {
    defaultSettings: {
      lintRules: {
        "no-unused-vars": "error",
        "no-console": "warn",
        "prefer-const": "error",
        "no-var": "error",
        eqeqeq: "error",
        curly: "error",
        "no-undef": "error",
        "no-redeclare": "error",
      },
      autoLint: true,
      lintOnSave: true,
      showWarnings: true,
    },
    supportedFileTypes: [".js", ".jsx", ".ts", ".tsx", ".vue"],
    severityLevels: ["error", "warning", "info"],
  },

  testing: {
    defaultSettings: {
      testFramework: "jest",
      testPattern: "**/*.{test,spec}.{js,jsx,ts,tsx}",
      coverage: true,
      watchMode: false,
      verbose: true,
    },
    frameworks: {
      jest: {
        configFile: "jest.config.js",
        command: "npm test",
        patterns: ["**/*.test.js", "**/*.spec.js"],
      },
      mocha: {
        configFile: ".mocharc.json",
        command: "npm run test:mocha",
        patterns: ["test/**/*.js", "spec/**/*.js"],
      },
      vitest: {
        configFile: "vitest.config.js",
        command: "npm run test:vitest",
        patterns: ["**/*.test.{js,ts}", "**/*.spec.{js,ts}"],
      },
    },
  },
};

export const getPluginConfig = (pluginId) => {
  return pluginConfig[pluginId] || {};
};

export const updatePluginConfig = (pluginId, newConfig) => {
  if (pluginConfig[pluginId]) {
    pluginConfig[pluginId] = {
      ...pluginConfig[pluginId],
      ...newConfig,
    };
  }
};

export default pluginConfig;
