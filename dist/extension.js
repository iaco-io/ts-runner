"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
class TsRunnerCodeLensProvider {
    provideCodeLenses(document) {
        // Only show for TypeScript files
        if (!document.fileName.endsWith('.ts') && !document.fileName.endsWith('.tsx')) {
            return [];
        }
        // Create a CodeLens on the first line
        const firstLine = document.lineAt(0);
        const range = new vscode.Range(firstLine.range.start, firstLine.range.start);
        const codeLens = new vscode.CodeLens(range, {
            title: '$(play) Run TS',
            command: 'ts-runner.run',
            arguments: [document.uri],
        });
        return [codeLens];
    }
}
function activate(context) {
    console.log('TS Runner extension activated');
    // Register the command
    const disposable = vscode.commands.registerCommand('ts-runner.run', async (fileUri) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No file is open');
            return;
        }
        const filePath = editor.document.uri.fsPath;
        const fileName = path.basename(filePath);
        // Check if the file is TypeScript
        if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
            vscode.window.showErrorMessage('Only TypeScript files are supported');
            return;
        }
        // Show status message
        vscode.window.showInformationMessage(`Running: ${fileName}`);
        // Run the command in terminal using ts-node
        const terminal = vscode.window.createTerminal(`TS Runner: ${fileName}`);
        terminal.sendText(`ts-node "${filePath}"`, true);
        terminal.show();
    });
    // Register CodeLens provider
    const codeLensProvider = new TsRunnerCodeLensProvider();
    const codeLensDisposable = vscode.languages.registerCodeLensProvider([{ language: 'typescript' }, { language: 'typescriptreact' }], codeLensProvider);
    context.subscriptions.push(disposable, codeLensDisposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
