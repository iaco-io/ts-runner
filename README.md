# TS Runner - VS Code Extension

Adds a play button to the editor (on top of first line and on title bar) for TypeScript files.

Click it to run the file with `ts-node file.ts`.

## Build as a .VSIX file

`npm run compile && npx @vscode/vsce package --allow-missing-repository`

## Install on VS Code

Open the 'Extensions' page in VS Code, click on the top three dots (...) and 'Install from VSIX...'
