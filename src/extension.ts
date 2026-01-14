import * as path from 'path'
import * as vscode from 'vscode'

class TsRunnerCodeLensProvider implements vscode.CodeLensProvider {
  onDidChangeCodeLenses?: vscode.Event<void> | undefined

  provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    // Only show for TypeScript files
    if (!document.fileName.endsWith('.ts') && !document.fileName.endsWith('.tsx')) {
      return []
    }

    // Create a CodeLens on the first line
    const firstLine = document.lineAt(0)
    const range = new vscode.Range(firstLine.range.start, firstLine.range.start)
    const codeLens = new vscode.CodeLens(range, {
      title: '$(play) Run TS',
      command: 'ts-runner.run',
      arguments: [document.uri],
    })

    return [codeLens]
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log('TS Runner extension activated')

  // Register the command
  const disposable = vscode.commands.registerCommand('ts-runner.run', async (fileUri?: vscode.Uri) => {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      vscode.window.showErrorMessage('No file is open')
      return
    }

    const filePath = editor.document.uri.fsPath
    const fileName = path.basename(filePath)

    // Check if the file is TypeScript
    if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
      vscode.window.showErrorMessage('Only TypeScript files are supported')
      return
    }

    // Show status message
    vscode.window.showInformationMessage(`Running: ${fileName}`)

    // Run the command in terminal using ts-node
    const terminal = vscode.window.createTerminal(`TS Runner: ${fileName}`)
    terminal.sendText(`ts-node "${filePath}"`, true)
    terminal.show()
  })

  // Register CodeLens provider
  const codeLensProvider = new TsRunnerCodeLensProvider()
  const codeLensDisposable = vscode.languages.registerCodeLensProvider(
    [{ language: 'typescript' }, { language: 'typescriptreact' }],
    codeLensProvider
  )

  context.subscriptions.push(disposable, codeLensDisposable)
}

export function deactivate() {}
