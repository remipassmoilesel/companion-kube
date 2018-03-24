import {IMainConfig} from './config-types';

export class AppConfigurationManager {
    private mainConfig: IMainConfig;

    constructor(mainConfig: IMainConfig){
        this.mainConfig = mainConfig;
    }

    public getConfigurationsFromPath(targetDirectory: string) {

    }
}
