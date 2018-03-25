import {IMainConfig} from '../main-config/configTypes';
import {AbstractExecutor} from './AbstractExecutor';
import {IKubeApplication} from '../app-config/appConfigTypes';
import {Logger} from '../misc/Logger';

export class HelmExecutor extends AbstractExecutor {
    public logger: Logger = new Logger();

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

    public destroy(app: IKubeApplication): Promise<any> {
        console.log('HelmExecutor');
        return Promise.resolve();
    }


}
