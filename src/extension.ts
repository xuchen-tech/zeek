// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ZeekControl } from './zeekControl';
import { FileSystemProvider } from './zeekLogExplorer';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "zeek" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('zeek.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from zeek!');
	});

	vscode.commands.registerCommand('fileExplorer.openFile', (resource) => {
		vscode.window.showTextDocument(resource);
	});
	
	const zeekLogsProvider = FileSystemProvider.getInstance();
	vscode.window.registerTreeDataProvider('zeekLogs', zeekLogsProvider);

	vscode.commands.registerCommand('zeekLogs.refreshEntity', () => {
		zeekLogsProvider.refreshLogs();
	});

	const zeekControl = new ZeekControl();
	vscode.commands.registerCommand('zeekContols.startZeek', () => {
		zeekControl.startZeek();
	});

	vscode.commands.registerCommand('zeekContols.stopZeek', () => {
		zeekControl.stopZeek();
	});

	vscode.commands.registerCommand('zeekContols.restartZeek', () => {
		zeekControl.restartZeek();
	});

	vscode.commands.registerCommand('zeekContols.getZeekStatus', () => {
		zeekControl.getZeekStatus();
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
