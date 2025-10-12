# StackMate - VS Code Extension

### Make your coding life easier with a single extension

A **multi-purpose Visual Studio Code extension** that opens a React-based webview to help you boost productivity — all **within VS Code**.  
Take notes, validate JSON, explore Stack Overflow, view coding stats, and more — all in one place!

---

## Current Features

- Write and save quick notes
- JSON Validator
- Stack Overflow shortcut
- Coding stats panel
- Cleanup Tool
- Color picker
- Theme switcher (light/dark)
- Language switcher
- Internet connectivity checker
- **Plugin System** with GitHub, ESLint, and Testing integration
- **GitHub Integration**: Access commits, issues, and repository data
- **ESLint Integration**: Real-time code linting and quality analysis
- **Test Runner**: Execute and manage tests with Jest/Mocha support
- Stores notes using browser `localStorage`
- Loads saved notes automatically
- Provides Dev tips
- Built with **React**, **Webpack**, and **VS Code API**

---

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Visual Studio Code](https://code.visualstudio.com/)
- `npm` (comes with Node.js)

---

## Setup Instructions

### 1. Clone the repository

`bash`
git clone [https://github.com/your-username/VS-code-Extension.git](https://github.com/nst-sdc/VS-code-Extension.git)
<br/> cd VS-code-Extension

### 2. Install dependencies

npm install

### 3. Build the React Webview

npx webpack

Wondering how to run the extension? here you go:

1. Open the folder in VS Code
2. Press F5 to launch an Extension Development Host.
3. In the new VS Code window, open Command Palette (Ctrl+Shift+P or Cmd+Shift+P) and search:
   "Show React Webview"

### Tadaaa! Your note-taking UI will now appear!

## 🔌 Plugin System

StackMate now includes a powerful plugin system! Access it by:

1. **Command Palette**: `Ctrl+Shift+P` → "Open Plugin Manager"
2. **Dashboard**: Click the "Plugin Manager" card
3. **Search**: Type `@plugins` in the search bar

### Available Plugins:

- **GitHub Integration**: `@github` - View commits, issues, and repo data
- **ESLint**: `@eslint` - Real-time code linting
- **Test Runner**: `@test` - Execute tests with Jest/Mocha

### Quick Commands:

- `extension.openPluginManager` - Open plugin interface
- `extension.runESLint` - Lint current file
- `extension.runTests` - Run test suite

See [PLUGIN_SYSTEM.md](PLUGIN_SYSTEM.md) for detailed documentation.

## Folder structure

vscode-notes-extension/ <br/>
├── .vscode/ <br/>
│ └── launch.json # VS Code debugger config <br/>
├── dist/ <br/>
│ └── bundle.js # Webview output by Webpack <br/>
├── src/ <br/>
│ ├── App.js # React component for notes <br/>
│ └── index.js # Entry file for Webpack <br/>
├── extension.js # Main VS Code extension logic <br/>
├── package.json # Project metadata & dependencies <br/>
├── webpack.config.js # Webpack config file <br/>
└── README.md # This file <br/>

## Scripts

In package.json, you can add:

"scripts": {
"build": "webpack",
"watch": "webpack --watch"}

then run:
npm run build # One-time build
npm run watch # Auto-rebuild on changes

## Contributing

Want to improve this extension? Awesome!

1. Fork the repo.

2. Create a new branch:
   command: git checkout -b feature/your-feature

3. Make your changes and build:
   command: npx webpack

4. Commit and push:
   commands: git add .
   git commit -m "Add: your message"
   git push origin feature/your-feature

5. Open a Pull Request.

## Gotchas

1. Missing CLI error? Run:
   npm install -D webpack-cli

2. Not seeing your changes? Rebuild with npx webpack and restart the Extension Host window.

### Made with 💙 by @sakina1303 @Kundan-CR7 @Uday-Choudhary @portneon
