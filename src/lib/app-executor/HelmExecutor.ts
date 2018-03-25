import {IMainConfig} from '../main-config/configTypes';
import {AbstractExecutor} from './AbstractExecutor';
import {IKubeApplication} from '../app-config/appConfigTypes';
import {Logger} from '../misc/Logger';
import {logFatalError} from '../misc/utils';

export class HelmExecutor extends AbstractExecutor {
    public logger: Logger = new Logger();

    constructor(mainConfig: IMainConfig) {
        super(mainConfig);
    }

    public isSupported(app: IKubeApplication): boolean {
        return app.projectType === 'chart';
    }

    public deploy(app: IKubeApplication, envName?: string): Promise<any> {
        this.logger.warning('Helm support is not yet ready !');
        return Promise.resolve();
    }

    public destroy(app: IKubeApplication, envName?: string): Promise<any> {
        this.logger.warning('Helm support is not yet ready !');
        return Promise.resolve();
    }


}
