import * as _ from 'lodash';
import {IMainConfig} from './main-config/configTypes';
import {Logger} from './misc/Logger';
import {PrerequisiteChecker} from './prerequisites/PrerequisiteChecker';
import {AppConfigurationManager} from './app-config/AppConfigurationManager';
import {IKubeApplication, IConfigValidationResult} from './app-config/appConfigTypes';

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

    public loadAppsConfiguration(targetDir: string): IConfigValidationResult {
        return this.appConfigMan.loadAppConfigurations(targetDir);
    }

    public getValidAppConfigurationsAsString(targetDir: string): string[] {
        const appConfigs = this.appConfigMan.loadAppConfigurations(targetDir);
        return _.map(appConfigs.valid, (conf) => conf.name as string);
    }

    public deployApplications(targetDir: string, appNames: string[], appNumbers: number[]) {
        console.log(appNumbers);
        console.log(appNames);
        const configs = this.loadAppsConfiguration(targetDir);
        _.forEach(configs.valid, (conf: IKubeApplication, index: number) => {
            const nameIsEqual = appNames.indexOf(conf.name) !== -1;
            const indexIsEqual = appNumbers.indexOf(index) !== -1;

            if (nameIsEqual || indexIsEqual){
                this.deployApplication(conf);
            }
        });
    }

    private deployApplication(conf: IKubeApplication) {

    }
}
