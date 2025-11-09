import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    const sendCommand = vscode.commands.registerCommand('extension.sendToRepl', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return vscode.window.showErrorMessage('No active editor.');

        const selection = editor.selection;
        const text = selection.isEmpty
            ? editor.document.lineAt(selection.start.line).text
            : editor.document.getText(selection);

        const langId = editor.document.languageId;
        const terminalName = context.globalState.get<string>(`repl.${langId}.terminal`);
        const startupCommand = context.globalState.get<string>(`repl.${langId}.startup`);

        let terminal = vscode.window.terminals.find(t => t.name === terminalName);

        if (!terminal && terminalName && startupCommand) {
            vscode.window.showInformationMessage(`Starting ${terminalName}...`);
            terminal = vscode.window.createTerminal({ name: terminalName });
            terminal.sendText(startupCommand, true);
        }

        if (!terminal) {
            return vscode.window.showErrorMessage(`No REPL configured for ${langId}.`);
        }

        terminal.show(true);
        terminal.sendText(text, true);
    });

    const setCommand = vscode.commands.registerCommand('extension.configureRepl', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return vscode.window.showErrorMessage('Open a file first.');
        const langId = editor.document.languageId;

        const name = await vscode.window.showInputBox({
            prompt: `Name of the REPL terminal for ${langId}`,
            placeHolder: 'e.g. Scala REPL'
        });
        if (!name) return;

        const startup = await vscode.window.showInputBox({
            prompt: `Startup command to run if the terminal does not exist`,
            placeHolder: 'e.g. scala'
        });

        await context.globalState.update(`repl.${langId}.terminal`, name);
        await context.globalState.update(`repl.${langId}.startup`, startup);
        vscode.window.showInformationMessage(`Configured REPL for ${langId}: ${name}`);
    });

    context.subscriptions.push(sendCommand, setCommand);
}

export function deactivate() {}