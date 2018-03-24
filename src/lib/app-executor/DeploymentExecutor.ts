import {IMainConfig} from '../main-config/configTypes';
import {AbstractExecutor} from './AbstractExecutor';
import {IKubeApplication} from '../app-config/appConfigTypes';

export class DeploymentExecutor extends AbstractExecutor {

    constructor(mainConfig: IMainConfig) {
        super(mainConfig);
    }

    public isSupported(app: IKubeApplication): boolean {
        return app.projectType === 'deployment';
    }

    public deploy(app: IKubeApplication): Promise<any> {
        console.log('DeploymentExecutor');
        return Promise.resolve();
    }

}
