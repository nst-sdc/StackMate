const vscode = require("vscode");
const path = require("path");

// Tag management functionality
const tagMap = new Map();

function extractTags(text) {
  const regex = /#(\w+)/g;
  const tags = new Set();
  let match;
  while ((match = regex.exec(text)) !== null) {
    tags.add(match[1]);
  }
  return tags;
}

let provider; // Declare here to use in scanDocument

function scanDocument(doc) {
  if (doc.languageId !== "markdown") return;
  const tags = extractTags(doc.getText());
  tagMap.set(doc.uri.toString(), tags);
  if (provider) provider.refresh();
}

// ─── Tree View Provider ────────────────────────────────────────────────────

class TagTreeProvider {
  constructor() {
    this._onDidChange = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChange.event;
  }

  refresh() {
    this._onDidChange.fire();
  }

  getChildren(element) {
    if (!element) {
      return Array.from(tagMap.entries()).map(
        ([uri, tags]) => {
          const item = new vscode.TreeItem(
            path.basename(uri),
            vscode.TreeItemCollapsibleState.Collapsed
          );
          item.tooltip = uri;
          return item;
        }
      );
    }
    const tags = tagMap.get(element.tooltip) || new Set();
    return Array.from(tags).map(tag => new vscode.TreeItem(
      `#${tag}`, vscode.TreeItemCollapsibleState.None
    ));
  }

  getTreeItem(item) {
    return item;
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Webview-related function to create CSP-compliant HTML
function activate(context) {
  // Register Webview Command
  const disposable = vscode.commands.registerCommand(
    "extension.showReactWebview",
    function () {
      const panel = vscode.window.createWebviewPanel(
        "reactWebview",
        "React Webview",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          localResourceRoots: [vscode.Uri.file(path.join(__dirname, "dist"))],
          retainContextWhenHidden: true,
        }
      );

      const nonce = getNonce();
      panel.webview.html = getWebviewContent(panel, nonce);

      panel.webview.onDidReceiveMessage(
        (message) => {
          if (message.command === "alert") {
            vscode.window.showInformationMessage(message.text);
          }
        },
        undefined,
        context.subscriptions
      );
    }
  );

  context.subscriptions.push(disposable);

  // Register Tag Detection Events
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(scanDocument),
    vscode.workspace.onDidSaveTextDocument(scanDocument)
  );
  vscode.workspace.textDocuments.forEach(scanDocument);

  // Register Tree View
  provider = new TagTreeProvider();
  vscode.window.registerTreeDataProvider("noteTags", provider);
  context.subscriptions.push(
    vscode.commands.registerCommand("noteTags.refresh", () => provider.refresh())
  );
}

// Generate nonce
function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(
      Math.floor(Math.random() * possible.length)
    );
  }
  return text;
}

// Create webview HTML content
function getWebviewContent(panel, nonce) {
  const bundlePath = vscode.Uri.file(
    path.join(__dirname, "dist", "bundle.js")
  );
  const bundleUri = panel.webview.asWebviewUri(bundlePath);

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          http-equiv="Content-Security-Policy"
          content="default-src 'none'; script-src 'nonce-${nonce}'; style-src 'unsafe-inline'; img-src data: https:; connect-src *;"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>React Webview</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          }
          #root {
            height: 100vh;
          }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script nonce="${nonce}" src="${bundleUri}"></script>
      </body>
    </html>
  `;
}

// Clean up when extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};