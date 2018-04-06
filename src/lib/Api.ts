import * as _ from 'lodash';
import * as path from 'path';
import {IMainConfig} from './main-config/configTypes';
import {Logger} from './misc/Logger';
import {PrerequisiteChecker} from './prerequisites/PrerequisiteChecker';
import {AppConfigurationManager} from './app-config/AppConfigurationManager';
import {AppType, IKubeApplication } from './app-config/appConfigTypes';
import {ExecutorFinder} from './app-executor/ExecutorFinder';
import {DirectoryInitHelper} from './helpers/DirectoryInitHelper';
import {DockerBuilder} from './helpers/DockerBuilder';
import {IRecursiveLoadingResult} from './app-config/configTypes';

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
        await this.dockerBuilder.build(app);
    }

    public loadAppConfiguration(targetDir: string): Promise<IKubeApplication> {
        const configPath = path.join(targetDir, 'ck-config.js');
        return this.appConfigMan.loadApplicationConfiguration(configPath);
    }

    public loadAppsConfigurationRecursively(targetDir: string): Promise<IRecursiveLoadingResult> {
        return this.appConfigMan.loadAppConfigurationsRecursively(targetDir);
    }

    public async getValidAppConfigurationsAsString(targetDir: string, appType: AppType): Promise<string[]> {
        const appConfigs = await this.appConfigMan.loadAppConfigurationsRecursively(targetDir);
        const inspectedApps = appType === AppType.SERVICE ? appConfigs.valid.serviceApps : appConfigs.valid.apps;
        return _.map(inspectedApps, (conf) => conf.name as string);
    }

    public async getAllAppsConfigs(targetDir: string, appType: AppType): Promise<IKubeApplication[]> {
        const appConfigs = await this.loadAppsConfigurationRecursively(targetDir);

        switch (appType) {
            case AppType.BOTH:
                return appConfigs.valid.serviceApps.concat(appConfigs.valid.apps);
            case AppType.SERVICE:
                return appConfigs.valid.serviceApps;
            default:
                return appConfigs.valid.apps;
        }
    }

    public async deployApplication(app: IKubeApplication, envName?: string) {
        const executor = ExecutorFinder.getExecutorForApp(this.mainConfig, app);
        await executor.deploy(app, envName);
    }

    public async destroyApplication(app: IKubeApplication, envName?: string) {
        const executor = ExecutorFinder.getExecutorForApp(this.mainConfig, app);
        await executor.destroy(app, envName);
    }

}
