# StackMate Plugin System

## Overview

StackMate now includes a comprehensive plugin system that allows users to access GitHub commits, lint results, and test runner outputs directly within the extension without switching tabs.

## Features

### 🔧 Plugin Architecture

- **Modular Design**: Each plugin is self-contained and follows a consistent interface
- **Plugin Manager**: Central system for registering, activating, and managing plugins
- **Event System**: Plugins can communicate with each other and the main application
- **Settings Management**: Each plugin can maintain its own configuration

### 🐙 GitHub Integration

- **Repository Data**: Fetch commits, issues, pull requests, and branches
- **Authentication**: Support for GitHub personal access tokens
- **Caching**: Intelligent caching to reduce API calls
- **Search**: Search repositories and filter results

**Available Actions:**

- View recent commits with author and date information
- Browse open/closed issues
- Check pull request status
- List repository branches
- Search public repositories

### 🔍 ESLint Integration

- **Real-time Linting**: Analyze JavaScript/TypeScript code for issues
- **Configurable Rules**: Customize linting rules based on your preferences
- **Multiple File Support**: Lint entire projects or individual files
- **Statistics**: View error/warning counts and rule breakdown

**Supported Rules:**

- `no-unused-vars`: Detect unused variables
- `no-console`: Flag console statements
- `prefer-const`: Prefer const over let when possible
- `no-var`: Disallow var declarations
- `eqeqeq`: Require === instead of ==
- `curly`: Require curly braces for control statements

### 🧪 Testing Integration

- **Multi-Framework Support**: Jest, Mocha, and Vitest compatibility
- **Test Discovery**: Automatically find test files in your project
- **Test Execution**: Run tests and view results
- **Coverage Reports**: Track test coverage statistics
- **Result Analysis**: Detailed pass/fail statistics

## Usage

### Accessing the Plugin Manager

1. **Via Command Palette**:

   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Open Plugin Manager"

2. **Via Dashboard**:

   - Open StackMate webview
   - Click on "Plugin Manager" card

3. **Via Search**:
   - Type `@plugins` in the search bar

### GitHub Plugin Setup

1. **Set Repository**:

   ```
   Owner: microsoft
   Repo: vscode
   ```

2. **Optional: Add GitHub Token**:

   - Generate a personal access token at https://github.com/settings/tokens
   - Add token in plugin settings for higher rate limits

3. **Fetch Data**:
   - Click "Get Commits" to view recent commits
   - Click "Get Issues" to see open issues

### ESLint Plugin Usage

1. **Lint Current File**:

   - Use command: "Run ESLint" (`Ctrl+Shift+P`)
   - Or paste code directly in the plugin interface

2. **View Results**:
   - Errors and warnings are displayed with line numbers
   - Click on issues to see detailed descriptions

### Testing Plugin Usage

1. **Discover Tests**:

   - Click "Find Tests" to scan for test files
   - Supports common test patterns

2. **Run Tests**:
   - Click "Run Tests" to execute all discovered tests
   - View pass/fail statistics and execution time

## Plugin Development

### Creating a New Plugin

1. **Extend BasePlugin**:

```javascript
import { BasePlugin } from "./BasePlugin.js";

export class MyPlugin extends BasePlugin {
  constructor() {
    super({
      id: "my-plugin",
      name: "My Plugin",
      version: "1.0.0",
      description: "Description of my plugin",
      icon: "IconName",
      category: "category",
    });
  }

  async activate() {
    await super.activate();
    // Plugin initialization logic
  }

  async executeAction(action, payload) {
    switch (action) {
      case "myAction":
        return await this.handleMyAction(payload);
      default:
        return await super.executeAction(action, payload);
    }
  }
}
```

2. **Register Plugin**:

```javascript
import pluginManager from "../plugins/PluginManager.js";
import { MyPlugin } from "./MyPlugin.js";

const myPlugin = new MyPlugin();
pluginManager.registerPlugin(myPlugin);
await pluginManager.activatePlugin("my-plugin");
```

### Plugin Interface

All plugins must implement:

- `activate()`: Initialize the plugin
- `deactivate()`: Clean up resources
- `executeAction(action, payload)`: Handle plugin-specific actions
- `getInfo()`: Return plugin metadata

## Commands

The plugin system adds several new VS Code commands:

- `extension.openPluginManager`: Open the plugin manager interface
- `extension.runESLint`: Run ESLint on the current file
- `extension.runTests`: Execute test suite

## Search Integration

Use these search triggers to quickly access plugin features:

- `@plugins`: Open plugin manager
- `@github`: Access GitHub integration
- `@eslint`: Run code linting
- `@test`: Execute tests

## Configuration

Plugin settings are stored in the extension's global state and persist between sessions. Each plugin maintains its own configuration namespace.

## Troubleshooting

### GitHub Plugin Issues

- **Rate Limiting**: Add a GitHub personal access token
- **Repository Not Found**: Check owner/repo spelling
- **Network Errors**: Verify internet connection

### ESLint Plugin Issues

- **No Results**: Ensure code contains JavaScript/TypeScript
- **Rule Errors**: Check rule configuration in settings

### Testing Plugin Issues

- **No Tests Found**: Verify test file patterns
- **Execution Errors**: Check test framework configuration

## Future Enhancements

- **Custom Plugin Support**: Allow users to create and install custom plugins
- **Plugin Marketplace**: Browse and install community plugins
- **Advanced GitHub Features**: PR reviews, code diff viewing
- **Enhanced Testing**: Coverage visualization, test debugging
- **CI/CD Integration**: Connect with build pipelines

## Contributing

To contribute to the plugin system:

1. Fork the repository
2. Create a feature branch
3. Implement your plugin following the established patterns
4. Add tests and documentation
5. Submit a pull request

## License

The plugin system is part of StackMate and follows the same MIT license.
