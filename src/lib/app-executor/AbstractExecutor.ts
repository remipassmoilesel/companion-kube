import {IMainConfig} from '../main-config/configTypes';
import {IKubeApplication} from '../app-config/appConfigTypes';

export abstract class AbstractExecutor {

    protected mainConfig: IMainConfig;

    constructor(mainConfig: IMainConfig) {
        this.mainConfig = mainConfig;
    }

    public abstract isSupported(app: IKubeApplication): boolean;
    public abstract deploy(app: IKubeApplication): Promise<any>;

}
