import * as _ from 'lodash';
import * as path from 'path';
import {IMainConfig} from './main-config/configTypes';
import {Logger} from './misc/Logger';
import {PrerequisiteChecker} from './prerequisites/PrerequisiteChecker';
import {AppConfigurationManager} from './app-config/AppConfigurationManager';
import {AppType, IKubeApplication} from './app-config/appConfigTypes';
import {ExecutorFinder} from './app-executor/ExecutorFinder';
import {DirectoryInitHelper} from './helpers/DirectoryInitHelper';
import {DockerBuilder} from './helpers/DockerBuilder';
import {IRecursiveLoadingResult} from './app-config/configTypes';
import {HookExecutor} from './helpers/HookExecutor';
import {CommandExecutor} from './misc/CommandExecutor';

const logger = new Logger();

export class Api {

    private mainConfig: IMainConfig;
    private prereqChecker: PrerequisiteChecker;
    private appConfigMan: AppConfigurationManager;
    private directoryHelper: DirectoryInitHelper;
    private dockerBuilder: DockerBuilder;
    private hookExecutor: HookExecutor;
    private commandExec: CommandExecutor;

    constructor(mainConfig: IMainConfig, commandExec: CommandExecutor) {
        this.commandExec = commandExec;
        this.mainConfig = mainConfig;
        this.prereqChecker = new PrerequisiteChecker(mainConfig);
        this.appConfigMan = new AppConfigurationManager(mainConfig);
        this.directoryHelper = new DirectoryInitHelper(mainConfig);
        this.dockerBuilder = new DockerBuilder(mainConfig, commandExec);
        this.hookExecutor = new HookExecutor(commandExec);
    }

    public getMissingPrerequisites() {
        return this.prereqChecker.getMissingPrerequisites();
    }

    public initDirectory(targetDir: string, force: boolean) {
        this.directoryHelper.init(targetDir, force);
    }

    public async buildApplication(app: IKubeApplication) {
        await this.hookExecutor.executePreBuildHook(app);
        await this.dockerBuilder.build(app);
    }

    public async pushApplication(app: IKubeApplication) {
        await this.dockerBuilder.push(app);
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
            case AppType.ALL:
                return appConfigs.valid.serviceApps.concat(appConfigs.valid.apps);
            case AppType.SERVICE:
                return appConfigs.valid.serviceApps;
          case AppType.CLUSTER:
                return appConfigs.valid.clusterApps;
            default:
                return appConfigs.valid.apps;
        }
    }

    public async deployApplication(app: IKubeApplication, envName?: string) {
        this.checkAppType(app);
        await this.hookExecutor.executePreDeployHook(app);
        const executor = ExecutorFinder.getExecutorForApp(this.mainConfig, this.commandExec, app);
        await executor.deploy(app, envName);
        await this.hookExecutor.executePostDeployHook(app);
    }

    public async destroyApplication(app: IKubeApplication, envName?: string) {
        this.checkAppType(app);
        await this.hookExecutor.executePreDestroyHook(app);
        const executor = ExecutorFinder.getExecutorForApp(this.mainConfig, this.commandExec, app);
        await executor.destroy(app, envName);
        await this.hookExecutor.executePostDestroyHook(app);
    }

    private checkAppType(app: IKubeApplication) {
        if (app.applicationStructure === 'scripts'){
            throw new Error('Script applications cannot be deployed or destroyed.');
        }
    }
}
