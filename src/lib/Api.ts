import * as _ from 'lodash';
import {IMainConfig} from './main-config/configTypes';
import {Logger} from './misc/Logger';
import {PrerequisiteChecker} from './prerequisites/PrerequisiteChecker';
import {AppConfigurationManager} from './app-config/AppConfigurationManager';
import {AppType, IConfigValidationResult, IKubeApplication} from './app-config/appConfigTypes';
import {ExecutorFinder} from './app-executor/ExecutorFinder';
import {DirectoryInitHelper} from './app-config/DirectoryInitHelper';
import {IAppError, IContainsAppErrors} from './misc/IAppError';

const logger = new Logger();

export class Api {
    private mainConfig: IMainConfig;
    private prereqChecker: PrerequisiteChecker;
    private appConfigMan: AppConfigurationManager;
    private directoryHelper: DirectoryInitHelper;

    constructor(mainConfig: IMainConfig) {
        this.mainConfig = mainConfig;
        this.prereqChecker = new PrerequisiteChecker(mainConfig);
        this.appConfigMan = new AppConfigurationManager(mainConfig);
        this.directoryHelper = new DirectoryInitHelper(mainConfig);
    }

    public initDirectory(targetDir: any, force: boolean) {
        this.directoryHelper.init(targetDir, force);
    }

    public getMissingPrerequisites() {
        return this.prereqChecker.getMissingPrerequisites();
    }

    public loadAppsConfiguration(targetDir: string): IConfigValidationResult {
        return this.appConfigMan.loadAppConfigurations(targetDir);
    }

    public getValidAppConfigurationsAsString(targetDir: string, appType: AppType): string[] {
        const appConfigs = this.appConfigMan.loadAppConfigurations(targetDir);
        const inspectedApps = appType === AppType.SERVICE ? appConfigs.valid.serviceApps : appConfigs.valid.apps;
        return _.map(inspectedApps, (conf) => conf.name as string);
    }

    public getAllAppsConfigs(targetDir: string, appType: AppType): IKubeApplication[] {
        const appConfigs = this.loadAppsConfiguration(targetDir);
        return appType === AppType.SERVICE ? appConfigs.valid.serviceApps : appConfigs.valid.apps;
    }

    public async deployApplication(app: IKubeApplication, envName?: string) {
        const executor = ExecutorFinder.getExecutorForApp(this.mainConfig, app);
        await executor.deploy(app, envName);
    }

    public async destroyApplication(app: IKubeApplication, envName?: string) {
        const executor = ExecutorFinder.getExecutorForApp(this.mainConfig, app);
        await executor.destroy(app, envName);
    }

    public async deployApplications(apps: IKubeApplication[], envName?: string) {
        await this.walkApplications(apps, async (app) => {
            await this.deployApplication(app, envName);
        });
    }

    public async destroyApplications(apps: IKubeApplication[], envName?: string) {
        await this.walkApplications(apps, async (app) => {
            await this.destroyApplication(app, envName);
        });
    }

    private async walkApplications(apps: IKubeApplication[], cb: (app: IKubeApplication) => Promise<any>) {
        const errors: IAppError[] = [];
        for (const app of apps) {
            try {
                await cb(app);
            } catch (error) {
                errors.push({
                    app,
                    error,
                });
            }
        }

        if (errors.length > 0) {
            const err: IContainsAppErrors = new Error('The following errors occurred: ');
            err.$appErrors = errors;
            throw err;
        }
    }

}
