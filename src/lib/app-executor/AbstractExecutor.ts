import {IMainConfig} from '../main-config/configTypes';
import {IKubeApplication} from '../app-config/appConfigTypes';
import {Logger} from '../misc/Logger';
import {exec} from 'child_process';

export abstract class AbstractExecutor {

    private exec = exec;
    protected abstract logger: Logger;
    protected mainConfig: IMainConfig;

    constructor(mainConfig: IMainConfig) {
        this.mainConfig = mainConfig;
    }

    public abstract isSupported(app: IKubeApplication): boolean;

    public abstract deploy(app: IKubeApplication): Promise<any>;
    public abstract destroy(app: IKubeApplication): Promise<any>;

    protected execCommand(command: string): any {
        this.logger.debug(`Executing command: ${command}`);

        return new Promise((resolve, reject) => {
            this.exec(command, (error: any, stdout, stderr) => {
                if (error) {
                    error.stdout = stdout;
                    error.stderr = stderr;
                    return reject(error);
                }
                return resolve({stdout, stderr});
            });
        });
    }
}
