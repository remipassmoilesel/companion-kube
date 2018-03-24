import * as _ from 'lodash';
import {IMainConfig} from './main-config/configTypes';
import {Logger} from './misc/Logger';
import {PrerequisiteChecker} from './prerequisites/PrerequisiteChecker';
import {AppConfigurationManager} from './app-config/AppConfigurationManager';
import {IConfigValidationResult, IKubeApplication} from './app-config/appConfigTypes';
import {ExecutorFinder} from './app-executor/ExecutorFinder';

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

    public async deployApplications(targetDir: string, appNames: string[], appNumbers: number[]) {
        const applications = this.loadAppsConfiguration(targetDir);

        const toDeploy: IKubeApplication[] = [];
        for (const appName of appNames) {
            const app = _.find(applications.valid, (ap) => ap.name === appName);
            if (!app) {
                throw new Error(`Not found: ${appName}`);
            }
            toDeploy.push(app);
        }

        for (const appNumber of appNumbers) {
            const app = _.find(applications.valid, (ap, index) => index === appNumber);
            if (!app) {
                throw new Error(`Not found: ${appNumber}`);
            }
            toDeploy.push(app);
        }

        const errors: Error[] = [];
        for (const app of toDeploy) {
            try {
                await this.deployApplication(app);
            } catch (e) {
                errors.push(e);
            }
        }

        if (errors.length > 0) {
            const err: any = new Error('Error while launching ')
            err.$origins = errors;
            throw err;
        }

    }

    public async deployApplication(app: IKubeApplication) {
        const executor = ExecutorFinder.getExecutorForApp(this.mainConfig, app);
        await executor.deploy(app);
    }

}
