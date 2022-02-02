import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class FileSystemProvider implements vscode.TreeDataProvider<string> {
	private static _instance: FileSystemProvider = new FileSystemProvider();

	public static getInstance() {
        return this._instance;
    }
	// private _onDidChangeTreeData: vscode.EventEmitter<string[] | undefined | void> = new vscode.EventEmitter<string[] | undefined | void>();
	private _onDidChangeTreeData: vscode.EventEmitter<string | undefined | null | void> = new vscode.EventEmitter<string | undefined | null | void>();
  	readonly onDidChangeTreeData: vscode.Event<string | undefined | null | void> = this._onDidChangeTreeData.event;
    
    getTreeItem(element: string): vscode.TreeItem {
        const treeItem = new vscode.TreeItem(element, vscode.TreeItemCollapsibleState.None);
        let zeekLogsPath = vscode.workspace.getConfiguration('zeek')['logs'] || '/opt/zeek/logs/current';
        const fileUri = vscode.Uri.file(path.join(zeekLogsPath, element));
        treeItem.command = { command: 'fileExplorer.openFile', title: "Open File", arguments: [fileUri], };
		treeItem.contextValue = 'file';
        return treeItem;
    }
    
    getChildren(element?: string): vscode.ProviderResult<string[]> {
        let zeekLogsPath = vscode.workspace.getConfiguration('zeek')['logs'] || '/opt/zeek/logs/current';

        if (!element) {
            return new Promise<string[]>((resolve, reject) => {
                fs.readdir(zeekLogsPath, (error, files) => {
                    if (error) {
                        reject(error);
                    } else {
                        let logFiles = files.filter(log => log.endsWith(".log"));
                        resolve(logFiles);
                    }
                })
            });
        } else {
            return null;
        }
    }

    refreshLogs() : void {
        this._onDidChangeTreeData.fire();        
    }
}