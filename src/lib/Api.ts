import * as _ from 'lodash';
import {IMainConfig} from './main-config/configTypes';
import {Logger} from './misc/Logger';
import {PrerequisiteChecker} from './commands/PrerequisiteChecker';
import {AppConfigurationManager} from './app-config/AppConfigurationManager';
import {IConfigValidationResult} from './app-config/appConfigTypes';

const logger = new Logger();

export class Api {
    private mainConfig: IMainConfig;
    private prereqChecker: PrerequisiteChecker;
    private appConfigMan: AppConfigurationManager;

    constructor(mainConfig: IMainConfig) {
        this.mainConfig = mainConfig;
        this.prereqChecker = new PrerequisiteChecker(mainConfig);
        this.appConfigMan = new AppConfigurationManager(mainConfig);
    }

    public getMissingPrerequisites() {
        return this.prereqChecker.getMissingPrerequisites();
    }

    public loadAppsConfiguration(targetDirectory: string): IConfigValidationResult {
        return this.appConfigMan.loadAppConfigurations(targetDirectory);
    }

    public getValidAppConfigurationsAsString(targetDirectory: string): string[] {
        const appConfigs = this.appConfigMan.loadAppConfigurations(targetDirectory);
        return _.map(appConfigs.valid, (conf) => conf.name as string);
    }
}
