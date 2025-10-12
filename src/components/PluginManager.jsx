import React, { useState, useEffect } from "react";
import {
  Github,
  AlertTriangle,
  TestTube,
  Settings,
  Play,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  GitCommit,
  GitBranch,
  Bug,
  FileText,
} from "lucide-react";

import pluginManager from "../plugins/PluginManager.js";
import { GitHubPlugin } from "../plugins/GitHubPlugin.js";
import { ESLintPlugin } from "../plugins/ESLintPlugin.js";
import { TestingPlugin } from "../plugins/TestingPlugin.js";

const PluginManager = ({ darkMode, language, translations }) => {
  const [activeTab, setActiveTab] = useState("github");
  const [plugins, setPlugins] = useState([]);
  const [loading, setLoading] = useState(false);

  const [githubData, setGithubData] = useState({
    commits: [],
    issues: [],
    repo: null,
  });
  const [githubSettings, setGithubSettings] = useState({
    owner: "",
    repo: "",
    token: "",
  });

  const [lintResults, setLintResults] = useState([]);
  const [lintStats, setLintStats] = useState(null);
  const [codeToLint, setCodeToLint] = useState("");

  const [testResults, setTestResults] = useState(null);
  const [testFiles, setTestFiles] = useState([]);

  useEffect(() => {
    initializePlugins();
  }, []);

  const initializePlugins = async () => {
    console.log("Initializing plugins...");
    try {
      const githubPlugin = new GitHubPlugin();
      const eslintPlugin = new ESLintPlugin();
      const testingPlugin = new TestingPlugin();

      console.log("Plugins created:", {
        githubPlugin,
        eslintPlugin,
        testingPlugin,
      });

      pluginManager.registerPlugin(githubPlugin);
      pluginManager.registerPlugin(eslintPlugin);
      pluginManager.registerPlugin(testingPlugin);

      console.log("Plugins registered");

      await pluginManager.activatePlugin("github");
      await pluginManager.activatePlugin("eslint");
      await pluginManager.activatePlugin("testing");

      console.log("Plugins activated");

      const allPlugins = pluginManager.getAllPlugins();
      console.log("All plugins:", allPlugins);
      setPlugins(allPlugins);
    } catch (error) {
      console.error("Failed to initialize plugins:", error);
    }
  };

  const handleGitHubAction = async (action, payload) => {
    console.log("GitHub action triggered:", action, payload);
    setLoading(true);
    try {
      const githubPlugin = pluginManager.getPlugin("github");
      console.log("GitHub plugin:", githubPlugin);

      const result = await githubPlugin.executeAction(action, payload);
      console.log("GitHub action result:", result);

      switch (action) {
        case "getCommits":
          setGithubData((prev) => ({ ...prev, commits: result }));
          break;
        case "getIssues":
          setGithubData((prev) => ({ ...prev, issues: result }));
          break;
        case "setRepo":
          setGithubData((prev) => ({ ...prev, repo: payload }));
          break;
      }
    } catch (error) {
      console.error("GitHub action failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleESLintAction = async (action, payload) => {
    setLoading(true);
    try {
      const result = await pluginManager
        .getPlugin("eslint")
        .executeAction(action, payload);

      switch (action) {
        case "lintCode":
          setLintResults([result]);
          break;
        case "getStats":
          setLintStats(result);
          break;
      }
    } catch (error) {
      console.error("ESLint action failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestingAction = async (action, payload) => {
    setLoading(true);
    try {
      const result = await pluginManager
        .getPlugin("testing")
        .executeAction(action, payload);

      switch (action) {
        case "runTests":
          setTestResults(result);
          break;
        case "findTestFiles":
          setTestFiles(result);
          break;
      }
    } catch (error) {
      console.error("Testing action failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderGitHubTab = () => (
    <div className="plugin-content">
      <div className="plugin-header">
        <h3>GitHub Integration</h3>
        <button
          onClick={() => handleGitHubAction("clearCache", {})}
          className="refresh-btn"
          disabled={loading}
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="github-settings">
        <div className="input-group">
          <input
            type="text"
            placeholder="Repository Owner"
            value={githubSettings.owner}
            onChange={(e) =>
              setGithubSettings((prev) => ({ ...prev, owner: e.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Repository Name"
            value={githubSettings.repo}
            onChange={(e) =>
              setGithubSettings((prev) => ({ ...prev, repo: e.target.value }))
            }
          />
          <button
            onClick={() =>
              handleGitHubAction("setRepo", {
                owner: githubSettings.owner,
                repo: githubSettings.repo,
              })
            }
            disabled={!githubSettings.owner || !githubSettings.repo}
          >
            Set Repository
          </button>
        </div>
      </div>

      <div className="github-actions">
        <button
          onClick={() =>
            handleGitHubAction("getCommits", {
              owner: githubSettings.owner,
              repo: githubSettings.repo,
              options: { limit: 10 },
            })
          }
          disabled={loading || !githubSettings.owner || !githubSettings.repo}
        >
          <GitCommit size={16} />
          Get Commits
        </button>

        <button
          onClick={() =>
            handleGitHubAction("getIssues", {
              owner: githubSettings.owner,
              repo: githubSettings.repo,
              options: { limit: 10 },
            })
          }
          disabled={loading || !githubSettings.owner || !githubSettings.repo}
        >
          <Bug size={16} />
          Get Issues
        </button>
      </div>

      <div className="github-results">
        {githubData.commits.length > 0 && (
          <div className="commits-section">
            <h4>Recent Commits</h4>
            <div className="commits-list">
              {githubData.commits.slice(0, 5).map((commit, index) => (
                <div key={index} className="commit-item">
                  <div className="commit-message">{commit.commit.message}</div>
                  <div className="commit-meta">
                    <span className="commit-author">
                      {commit.commit.author.name}
                    </span>
                    <span className="commit-date">
                      {new Date(commit.commit.author.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {githubData.issues.length > 0 && (
          <div className="issues-section">
            <h4>Open Issues</h4>
            <div className="issues-list">
              {githubData.issues.slice(0, 5).map((issue, index) => (
                <div key={index} className="issue-item">
                  <div className="issue-title">{issue.title}</div>
                  <div className="issue-meta">
                    <span className="issue-number">#{issue.number}</span>
                    <span className="issue-state">{issue.state}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderESLintTab = () => (
    <div className="plugin-content">
      <div className="plugin-header">
        <h3>ESLint Integration</h3>
        <div className="lint-stats">
          {lintStats && (
            <span className="stats-badge">
              {lintStats.totalErrors} errors, {lintStats.totalWarnings} warnings
            </span>
          )}
        </div>
      </div>

      <div className="lint-input">
        <textarea
          placeholder="Paste your JavaScript code here to lint..."
          value={codeToLint}
          onChange={(e) => setCodeToLint(e.target.value)}
          rows={10}
        />
        <button
          onClick={() =>
            handleESLintAction("lintCode", {
              code: codeToLint,
              filename: "input.js",
            })
          }
          disabled={loading || !codeToLint.trim()}
        >
          <AlertTriangle size={16} />
          Lint Code
        </button>
      </div>

      <div className="lint-results">
        {lintResults.map((result, index) => (
          <div key={index} className="lint-result">
            <div className="result-header">
              <FileText size={16} />
              <span>{result.filename}</span>
              <div className="result-counts">
                <span className="error-count">{result.errorCount} errors</span>
                <span className="warning-count">
                  {result.warningCount} warnings
                </span>
              </div>
            </div>

            <div className="issues-list">
              {result.issues.map((issue, issueIndex) => (
                <div
                  key={issueIndex}
                  className={`issue-item ${issue.severity}`}
                >
                  <div className="issue-location">
                    Line {issue.line}:{issue.column}
                  </div>
                  <div className="issue-message">{issue.message}</div>
                  <div className="issue-rule">{issue.rule}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTestingTab = () => (
    <div className="plugin-content">
      <div className="plugin-header">
        <h3>Test Runner</h3>
        <div className="test-actions">
          <button
            onClick={() => handleTestingAction("findTestFiles", {})}
            disabled={loading}
          >
            <FileText size={16} />
            Find Tests
          </button>
          <button
            onClick={() =>
              handleTestingAction("runTests", { files: testFiles })
            }
            disabled={loading || testFiles.length === 0}
          >
            <Play size={16} />
            Run Tests
          </button>
        </div>
      </div>

      {testFiles.length > 0 && (
        <div className="test-files">
          <h4>Test Files Found</h4>
          <div className="files-list">
            {testFiles.map((file, index) => (
              <div key={index} className="file-item">
                <TestTube size={16} />
                <span>{file.name}</span>
                <span className="file-path">{file.path}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {testResults && (
        <div className="test-results">
          <div className="results-summary">
            <div className="summary-item">
              <CheckCircle size={16} className="success" />
              <span>{testResults.passed} passed</span>
            </div>
            <div className="summary-item">
              <XCircle size={16} className="error" />
              <span>{testResults.failed} failed</span>
            </div>
            <div className="summary-item">
              <Clock size={16} />
              <span>{testResults.duration}ms</span>
            </div>
            <div className="summary-item">
              <span>{testResults.passRate}% pass rate</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: "github", label: "GitHub", icon: Github },
    { id: "eslint", label: "ESLint", icon: AlertTriangle },
    { id: "testing", label: "Testing", icon: TestTube },
  ];

  return (
    <div className={`plugin-manager ${darkMode ? "dark" : ""}`}>
      <div className="plugin-tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="plugin-content-wrapper">
        {loading && <div className="loading-overlay">Loading...</div>}

        {activeTab === "github" && renderGitHubTab()}
        {activeTab === "eslint" && renderESLintTab()}
        {activeTab === "testing" && renderTestingTab()}
      </div>
    </div>
  );
};

export default PluginManager;
