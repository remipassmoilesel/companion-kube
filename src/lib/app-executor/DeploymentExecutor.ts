import {IMainConfig} from '../main-config/configTypes';
import {AbstractExecutor} from './AbstractExecutor';
import {IKubeApplication} from '../app-config/appConfigTypes';
import {execSync} from 'child_process';
import {Logger} from '../misc/Logger';

export class DeploymentExecutor extends AbstractExecutor {
    public logger: Logger = new Logger();

    constructor(mainConfig: IMainConfig) {
        super(mainConfig);
    }

    public isSupported(app: IKubeApplication): boolean {
        return app.projectType === 'deployment';
    }

    public async deploy(app: IKubeApplication, envName?: string): Promise<any> {
        this.logger.info(`Deploying ${app.name} as a Kubernetes deployment`);

        let command = `kubectl create %namespace -f ${app.rootPath}`;
        command = this.replaceNamespace(command, envName);

        return this.execCommand(command);
    }

    public async destroy(app: IKubeApplication, envName?: string): Promise<any> {
        this.logger.info(`Destroying ${app.name} as a Kubernetes deployment`);

        let command = `kubectl delete %namespace -f ${app.rootPath}`;
        command = this.replaceNamespace(command, envName);

        return this.execCommand(command);
    }

    private replaceNamespace(command: string, envName?: string): string {
        const namespace = envName ? `--namespace ${envName}` : '';
        return command.replace('%namespace', namespace);
    }
}
