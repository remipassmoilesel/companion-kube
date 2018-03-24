import {IMainConfig} from '../main-config/configTypes';
import {AbstractExecutor} from './AbstractExecutor';
import {IKubeApplication} from '../app-config/appConfigTypes';

export class HelmExecutor extends AbstractExecutor {

    constructor(mainConfig: IMainConfig) {
        super(mainConfig);
    }

    public isSupported(app: IKubeApplication): boolean {
        return app.projectType === 'chart';
    }

    public deploy(app: IKubeApplication): Promise<any> {
        console.log('HelmExecutor');
        return Promise.resolve();
    }


}
