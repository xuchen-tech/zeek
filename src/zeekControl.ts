import * as vscode from 'vscode';
import * as childProcess from 'child_process';
import * as schedule from 'node-schedule';
import { FileSystemProvider } from './zeekLogExplorer';
import { resourceLimits } from 'worker_threads';

export class ZeekControl {
    private zeekctlBinPath: string = '/opt/zeek/bin/zeekctl';
    private statusBar: vscode.StatusBarItem;
    private fileSystemProvier = FileSystemProvider.getInstance();
    constructor() {
        this.zeekctlBinPath = vscode.workspace.getConfiguration('zeekctl')['executable'];
        this.statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        let rule = new schedule.RecurrenceRule();
        rule.second = 30;
        schedule.scheduleJob(rule, () => {
            this.zeekCtlExecute('status');
        });
    }

    startZeek(): void {
        this.zeekCtlExecute('start');
        this.zeekCtlExecute('status');
    }

    stopZeek(): void {
        this.zeekCtlExecute('stop');
        this.zeekCtlExecute('status');
    }

    restartZeek(): void {
        this.zeekCtlExecute('deploy');
        this.zeekCtlExecute('status');
    }

    getZeekStatus(): void {
        this.zeekCtlExecute('status');
    }

    private zeekCtlExecute(command: string): void {
        childProcess.execFile(this.zeekctlBinPath, [command], null, (err, stdout, stderr) => {
            if (err && err.code == 'ENOENT') {
                vscode.window.showErrorMessage('Can\'t find zeekctl. (' + this.zeekctlBinPath + ')');
                return;
            }
            // if (err) {
            //     if (stderr instanceof String) {
            //         const errMsg = stderr.split(/\r\n|\r|\n/g).join(',') + ' ' + err;
            //         vscode.window.showErrorMessage('Failed to launch zeekctl. (reason: "' + errMsg + '")');
            //     }
            //     return;
            // }
            this.fileSystemProvier.refreshLogs();
            if (command.localeCompare('status') == 0)
                this.handleZeekStatus(stdout as string);
        });
    }

    private handleZeekStatus(status: string): void {
        const rawStatus = status.split(/\r\n|\r|\n/g);
        const validStatus = rawStatus.slice(1, rawStatus.length - 1);
        if (validStatus.length == 1) {
            const statusValue = validStatus[0].split(" ").filter(s => 
                !(s.localeCompare('') == 0));
            let name = statusValue[0];
            let type = statusValue[1];
            let host = statusValue[2];
            let status = statusValue[3];
            if (status.localeCompare('running') == 0)
                this.statusBar.text = '$(tools) ' + type + ' $(debug-start) ' + status;
            else
                this.statusBar.text = '$(tools) ' + type + ' $(debug-stop) ' + status;
            this.statusBar.show();
        } 
    }
}