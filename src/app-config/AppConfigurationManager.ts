import {IMainConfig} from '../main-config/config-types';
import {GlobSync} from 'glob';

export class AppConfigurationManager {
    private mainConfig: IMainConfig;

    constructor(mainConfig: IMainConfig) {
        this.mainConfig = mainConfig;
    }

    public getConfigurationsFromPath(targetDirectory: string) {
        const foundConfigurations = this.searchConfigurations();
        console.log(foundConfigurations)
    }

    private searchConfigurations(): string[] {
        const glob = new GlobSync('**/ck-config.js', {
            ignore: this.mainConfig.configSearchIgnore,
            realpath: true,
        });
        return glob.found;
    }
}
