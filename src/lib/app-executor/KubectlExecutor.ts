import {IMainConfig} from '../main-config/configTypes';
import {AbstractAppExecutor} from './AbstractAppExecutor';
import {IKubeApplication} from '../app-config/appConfigTypes';
import {execSync} from 'child_process';
import {Logger} from '../misc/Logger';

export class KubectlExecutor extends AbstractAppExecutor {
    public logger: Logger = new Logger();

    constructor(mainConfig: IMainConfig) {
        super(mainConfig);
    }

    public isSupported(app: IKubeApplication): boolean {
        return app.applicationStructure === 'deployment';
    }

    public async deploy(app: IKubeApplication, envName?: string): Promise<any> {
        const namespaceOption = envName ? `--namespace ${envName}` : '';
        const command = `kubectl create ${namespaceOption} -f ${app.rootPath}`;

        await this.execCommand(command);
    }

    public async destroy(app: IKubeApplication, envName?: string): Promise<any> {
        const namespaceOption = envName ? `--namespace ${envName}` : '';
        const command = `kubectl delete ${namespaceOption} -f ${app.rootPath}`;

        await this.execCommand(command);
    }

}
