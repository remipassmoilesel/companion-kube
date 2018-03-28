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
        this.logger.info(`Deploying ${app.name}`);

        let command = `kubectl create %namespace -f ${app.rootPath}`;
        command = this.replaceNamespace(command, envName);

        await this.execCommand(command);
        this.logger.success(`Finished !`);
    }

    public async destroy(app: IKubeApplication, envName?: string): Promise<any> {
        this.logger.info(`Destroying ${app.name}`);

        let command = `kubectl delete %namespace -f ${app.rootPath}`;
        command = this.replaceNamespace(command, envName);

        await this.execCommand(command);
        this.logger.success(`Finished !`);
    }

    private replaceNamespace(command: string, envName?: string): string {
        const namespace = envName ? `--namespace ${envName}` : '';
        return command.replace('%namespace', namespace);
    }
}
