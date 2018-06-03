import * as _ from 'lodash';
import {spawn} from 'child_process';

export interface ICommandExecutorOptions {
    displayOutput?: boolean;
}

export class CommandExecutor {

    public execCommand(command: string,
                       executorOptions: ICommandExecutorOptions,
                       spawnOptions?: any): Promise<any> {

        return new Promise((resolve, reject) => {

            const allOptions = _.merge({shell: true}, spawnOptions);
            const scriptCmd = spawn(command, [], allOptions);
            let allStdout = '';
            let allStderr = '';

            scriptCmd.stdout.on('data', (data: any) => {
                allStdout += data.toString();
                if (executorOptions.displayOutput) {
                    process.stdout.write(data.toString());
                }
            });

            scriptCmd.stderr.on('data', (data: any) => {
                allStderr += data.toString();
                if (executorOptions.displayOutput) {
                    process.stdout.write(data.toString());
                }
            });

            scriptCmd.on('close', (code: number) => {
                if (code !== 0) {
                    reject(new Error(allStderr + '\n Exit code: ' + code));
                    return;
                }
                resolve(allStdout);
            });

            scriptCmd.on('error', (err: Error) => {
                return reject(err);
            });
        });

    }
}
