const vscode = require("vscode");
const path = require("path");

// ─── Tag Detection ─────────────────────────────────────────────────────────

const tagMap = new Map(); // Map<Document URI, Set<string>>

function extractTags(text) {
  const regex = /#(\w+)/g;
  const tags = new Set();
  let match;
  while ((match = regex.exec(text)) !== null) {
    tags.add(match[1]);
  }
  return tags;
}

function scanDocument(doc) {
  if (doc.languageId !== "markdown") return;
  const tags = extractTags(doc.getText());
  tagMap.set(doc.uri.toString(), tags);
  provider.refresh();
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
      // root: list all files with tags
      return Array.from(tagMap.entries()).map(
        ([uri, tags]) => new vscode.TreeItem(path.basename(uri), vscode.TreeItemCollapsibleState.Collapsed, uri)
      );
    }
    // element is a file URI, show its tags
    const tags = tagMap.get(element.tooltip) || new Set();
    return Array.from(tags).map(tag => new vscode.TreeItem(`#${tag}`, vscode.TreeItemCollapsibleState.None));
  }
  getTreeItem(item) {
    const treeItem = new vscode.TreeItem(
      item.label,
      item.collapsibleState
    );
    if (item.collapsibleState !== vscode.TreeItemCollapsibleState.None) {
      treeItem.tooltip = item.tooltip;
      treeItem.contextValue = "fileWithTags";
    }
    return treeItem;
  }
}

// ─── Extension Activation ──────────────────────────────────────────────────

let provider;

function activate(context) {
  // Webview command
  const disposable = vscode.commands.registerCommand("extension.showReactWebview", function () {
    const panel = vscode.window.createWebviewPanel(
      "reactWebview",
      "React Webview",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(path.join(__dirname, "dist"))],
      }
    );
    panel.webview.html = getWebviewContent(panel);
  });
  context.subscriptions.push(disposable);

  // Tag detection
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(scanDocument),
    vscode.workspace.onDidSaveTextDocument(scanDocument)
  );
  vscode.workspace.textDocuments.forEach(scanDocument);

  // Tree view setup
  provider = new TagTreeProvider();
  vscode.window.registerTreeDataProvider("noteTags", provider);
  context.subscriptions.push(
    vscode.commands.registerCommand("noteTags.refresh", () => provider.refresh())
  );
}

function getWebviewContent(panel) {
  const bundlePath = vscode.Uri.file(
    path.join(__dirname, "dist", "bundle.js")
  );
  const bundleUri = panel.webview.asWebviewUri(bundlePath);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>React Webview</title>
    </head>
    <body>
      <div id="root"></div>
      <script src="${bundleUri}"></script>
    </body>
    </html>
  `;
}

function deactivate() {}

module.exports = { activate, deactivate };

