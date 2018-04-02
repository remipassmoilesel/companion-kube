import * as _ from 'lodash';
import {IMainConfig} from '../main-config/configTypes';
import {IKubeApplication} from '../app-config/appConfigTypes';
import {Logger} from '../misc/Logger';
import {spawn} from 'child_process';

export abstract class AbstractAppExecutor {

    private spawn = spawn;
    protected abstract logger: Logger;
    protected mainConfig: IMainConfig;

    constructor(mainConfig: IMainConfig) {
        this.mainConfig = mainConfig;
    }

    public abstract isSupported(app: IKubeApplication): boolean;

    public abstract deploy(app: IKubeApplication, envName?: string): Promise<any>;

    public abstract destroy(app: IKubeApplication, envName?: string): Promise<any>;

    protected execCommand(command: string, displayOutput?: boolean, options?: any): Promise<any> {
        this.logger.debug(`Executing command: ${command}`);

        return new Promise((resolve, reject) => {

            const allOptions = _.merge({shell: true}, options);
            const scriptCmd = spawn(command, [], allOptions);
            let allStdout = '';
            let allStderr = '';

            scriptCmd.stdout.on('data', (data: any) => {
                allStdout += data.toString();
                if (displayOutput) {
                    process.stdout.write(data.toString());
                }
            });

            scriptCmd.stderr.on('data', (data: any) => {
                allStderr += data.toString();
                if (displayOutput) {
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
