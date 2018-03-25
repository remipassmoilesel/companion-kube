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

    public async deploy(app: IKubeApplication): Promise<any> {
        this.logger.info('Deploying ' + app.name + ' as a Kubernetes deployment');
        await this.execCommand(`kubectl create -f ${app.rootPath}`);
        return Promise.resolve();
    }

    public async destroy(app: IKubeApplication): Promise<any> {
        this.logger.info('Deploying ' + app.name + ' as a Kubernetes deployment');
        await this.execCommand(`kubectl delete -f ${app.rootPath}`);
        return Promise.resolve();
    }

}
