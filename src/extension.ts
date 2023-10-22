import * as vscode from 'vscode';
import * as child_process from 'child_process';


///////////////////////////////////////////////////////////////////////////////////////////////////
function decoratePath(path: String): string {
	return '"' + path + '"';
}

///////////////////////////////////////////////////////////////////////////////////////////////////
export const COMMAND_TYPE = {
	log: "log",
	settings: "settings",
} as const;
export type CommandType = typeof COMMAND_TYPE[keyof typeof COMMAND_TYPE];


async function commandImpl(
	editor: vscode.TextEditor,
	commandType: CommandType) {
	const workspaceFolders = vscode.workspace.workspaceFolders;

	if (!workspaceFolders || workspaceFolders.length === 0) {
		vscode.window.showErrorMessage("Workspace not found.");
		return;
	}

	workspaceFolders.forEach(dirPath => {
		const command = "TortoiseGitProc.exe /command:" + commandType + " /path:" + decoratePath(dirPath.uri.fsPath);
		child_process.exec(command, (err, stdout, stderr) => {
			if (err) {
				vscode.window.showErrorMessage(`command: ${command} , stderr: ${stderr}`);
			}
		}
		);
	});
}

///////////////////////////////////////////////////////////////////////////////////////////////////
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('opentortoisegit.TortoiseGitLog', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) { return; }

		commandImpl(editor, 'log');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('opentortoisegit.TortoiseGitSettings', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) { return; }

		commandImpl(editor, 'settings');
	}));
}

export function deactivate() { }

