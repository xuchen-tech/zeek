import * as vscode from 'vscode';
import * as childProcess from 'child_process';
import { FileSystemProvider } from './zeekLogExplorer';

export class ZeekControl {
    private zeekctlBinPath: string = '/opt/zeek/bin/zeekctl';
    private fileSystemProvier = FileSystemProvider.getInstance();
    constructor() {
        this.zeekctlBinPath = vscode.workspace.getConfiguration('zeekctl')['executable'];
    }

    startZeek(): void {
        childProcess.execFile(this.zeekctlBinPath, ["start"], null, (err, stdout, stderr) => {
           this.fileSystemProvier.refreshLogs();
        });
    }

    stopZeek(): void {
        childProcess.execFile(this.zeekctlBinPath, ["stop"], null, (err, stdout, stderr) => {
            this.fileSystemProvier.refreshLogs();
        });
    }

    restartZeek(): void {
        childProcess.execFile(this.zeekctlBinPath, ["deploy"], null, (err, stdout, stderr) => {
            this.fileSystemProvier.refreshLogs();
        });
    }

    getZeekStatus(): string {
        return 'test';
    }
}