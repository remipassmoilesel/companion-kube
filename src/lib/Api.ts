import * as _ from 'lodash';
import * as path from 'path';
import {IMainConfig} from './main-config/configTypes';
import {Logger} from './misc/Logger';
import {PrerequisiteChecker} from './prerequisites/PrerequisiteChecker';
import {AppConfigurationManager} from './app-config/AppConfigurationManager';
import {AppType, IKubeApplication, IRecursiveLoadingResult} from './app-config/appConfigTypes';
import {ExecutorFinder} from './app-executor/ExecutorFinder';
import {DirectoryInitHelper} from './app-config/DirectoryInitHelper';
import {IAppError, IContainsAppErrors} from './misc/IAppError';
import {DockerBuilder} from './app-config/DockerBuilder';

const logger = new Logger();

export class Api {
    private mainConfig: IMainConfig;
    private prereqChecker: PrerequisiteChecker;
    private appConfigMan: AppConfigurationManager;
    private directoryHelper: DirectoryInitHelper;
    private dockerBuilder: DockerBuilder;

    constructor(mainConfig: IMainConfig) {
        this.mainConfig = mainConfig;
        this.prereqChecker = new PrerequisiteChecker(mainConfig);
        this.appConfigMan = new AppConfigurationManager(mainConfig);
        this.directoryHelper = new DirectoryInitHelper(mainConfig);
        this.dockerBuilder = new DockerBuilder(mainConfig);
    }

    public getMissingPrerequisites() {
        return this.prereqChecker.getMissingPrerequisites();
    }

    public initDirectory(targetDir: string, force: boolean) {
        this.directoryHelper.init(targetDir, force);
    }

    public async buildApplication(app: IKubeApplication) {
        if (app.docker) {
            logger.info('Building application ...');
            await this.dockerBuilder.build(app);
            logger.success('Done !');
        }
    }

    public async buildApplications(apps: IKubeApplication[]) {
        for (const app of apps) {
            await this.buildApplication(app);
        }
    }

    public loadAppConfiguration(targetDir: string): IKubeApplication {
        const configPath = path.join(targetDir, 'ck-config.js');
        return this.appConfigMan.loadApplicationConfiguration(configPath);
    }

    public loadAppsConfigurationRecursively(targetDir: string): IRecursiveLoadingResult {
        return this.appConfigMan.loadAppConfigurationsRecursively(targetDir);
    }

    public getValidAppConfigurationsAsString(targetDir: string, appType: AppType): string[] {
        const appConfigs = this.appConfigMan.loadAppConfigurationsRecursively(targetDir);
        const inspectedApps = appType === AppType.SERVICE ? appConfigs.valid.serviceApps : appConfigs.valid.apps;
        return _.map(inspectedApps, (conf) => conf.name as string);
    }

    public getAllAppsConfigs(targetDir: string, appType: AppType): IKubeApplication[] {
        const appConfigs = this.loadAppsConfigurationRecursively(targetDir);
        if (appType === AppType.ALL) {
            return appConfigs.valid.serviceApps.concat(appConfigs.valid.apps);
        } else if (AppType.SERVICE) {
            return appConfigs.valid.serviceApps;
        }
        return appConfigs.valid.apps;
    }

    public async deployApplication(app: IKubeApplication, envName?: string) {
        const executor = ExecutorFinder.getExecutorForApp(this.mainConfig, app);
        const envNameWithDef = envName || app.defaultEnvironment || 'unknown';

        logger.info(`Deploying ${app.name} on environment ${envNameWithDef}`);
        await executor.deploy(app, envNameWithDef);
        logger.success(`Application deployed !\n`);
    }

    public async destroyApplication(app: IKubeApplication, envName?: string) {
        const executor = ExecutorFinder.getExecutorForApp(this.mainConfig, app);
        const envNameWithDef = envName || app.defaultEnvironment;

        logger.info(`Destroying ${app.name} on environment ${envNameWithDef}`);
        await executor.destroy(app, envNameWithDef);
        logger.success(`Application destroyed !\n`);
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
