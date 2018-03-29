import * as _ from 'lodash';
import {execSync} from 'child_process';
import {IMainConfig} from '../main-config/configTypes';
import {Logger} from '../misc/Logger';
import {Api} from '../Api';
import {CliOperations, IDeployArguments, IDeployOptions, IInitOptions, IRunArguments} from './cliTypes';
import {CliDisplay} from './CliDisplay';
import {AppType, IKubeApplication} from '../app-config/appConfigTypes';
import {ScriptRunner} from '../app-config/ScriptRunner';

const logger = new Logger();

export class CliHandlers {
    private mainConfig: IMainConfig;
    private api: Api;
    private display: CliDisplay;

    constructor(mainConfig: IMainConfig, api: Api) {
        this.mainConfig = mainConfig;
        this.api = api;
        this.display = new CliDisplay();
    }

    public initDirectory(args: any, options: IInitOptions) {
        this.display.showCliHeader();
        this.api.initDirectory(process.cwd(), options.f);
        logger.success('File ck-config.js created !');
    }

    public async runScript(args: IRunArguments, options: any) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        const scriptName = args.script;

        const scriptRunner = new ScriptRunner();
        const appConfig: IKubeApplication = this.api.loadAppConfiguration(process.cwd());

        const script = _.find(appConfig.scripts, (scriptCom, scriptNam) => scriptNam === scriptName);
        if (!script) {
            throw new Error(` '${scriptName}' not found !`);
        }

        await scriptRunner.run(script);
    }

    public listApplications(args: any, options: any) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        const appConfigs = this.api.loadAppsConfigurationRecursively(process.cwd());
        this.display.showValidApps(appConfigs);
        this.display.showValidServiceComponents(appConfigs);

        if (appConfigs.invalid.length > 0) {
            this.display.showInvalidConfigurations(appConfigs);
            throw new Error('Invalid configuration');
        }
        else if (appConfigs.valid.apps.length > 0 || appConfigs.valid.serviceApps.length > 0) {
            logger.success('All configurations are valid !');
        }
    }

    public async buildApplications(args: IDeployArguments, options: IDeployOptions) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        const {envName, apps} = await this.selectApps(AppType.BOTH, args, options);
        await this.display.showWarningOnApps(CliOperations.BUILD, apps, envName);

        await this._buildApplications(apps);
    }

    public async deployApplications(appType: AppType, args: IDeployArguments, options: IDeployOptions) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        const {apps, envName} = await this.selectApps(appType, args, options);
        await this.display.showWarningOnApps(CliOperations.DEPLOY, apps, envName);

        await this._buildApplications(apps);

        await this._deployApplications(apps, envName);
    }

    public async redeployApplications(appType: AppType, args: IDeployArguments, options: IDeployOptions) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        const {apps, envName} = await this.selectApps(appType, args, options);
        await this.display.showWarningOnApps(CliOperations.REDEPLOY, apps, envName);

        try {
            await this._destroyApplications(apps, envName);
        } catch (e) {
            logger.error('Cleaning did not go well ...');
        }

        await this.wait(1.5);

        await this._buildApplications(apps);

        await this._deployApplications(apps, envName);
    }

    public async destroyApplications(appType: AppType, args: IDeployArguments, options: IDeployOptions) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        const {apps, envName} = await this.selectApps(appType, args, options);
        await this.display.showWarningOnApps(CliOperations.DESTROY, apps, envName);

        await this._destroyApplications(apps, envName);
    }

    private checkPrerequisites() {
        const missingPrerequisites = this.api.getMissingPrerequisites();
        if (missingPrerequisites.length > 0) {
            this.display.showMissingPrerequisites(missingPrerequisites);
            throw new Error('Missing prerequisites');
        }
    }

    private async selectApps(appType: AppType, args: IDeployArguments, options?: IDeployOptions) {
        const envName: string | undefined = options && options.e;
        const getAllConfig = args.applications.indexOf('all') !== -1;

        const targetDir = process.cwd();

        const {appNames, appIds} = this.getAppNamesAndIds(args.applications);

        let apps: IKubeApplication[];

        if (getAllConfig) {
            apps = this.api.getAllAppsConfigs(targetDir, appType);
        }

        else if (!appNames.length && !appIds.length) {
            apps = [this.api.loadAppConfiguration(targetDir)];
        }

        else {
            apps = this.getAppConfigs(targetDir, appType, appNames, appIds);
        }

        return {apps, envName};
    }

    private getAppNamesAndIds(args: string[]) {
        const appNames: string[] = [];
        const appIds: number[] = [];

        _.forEach(args, (app: any) => {
            isNaN(app) ? appNames.push(app) : appIds.push(app.id);
        });

        return {appNames, appIds};
    }

    private getAppConfigs(targetDir: string, appType: AppType, appNames: string[],
                          appIds: number[]): IKubeApplication[] {
        const configurations = this.api.loadAppsConfigurationRecursively(targetDir);

        const allApps = configurations.valid.apps.concat(configurations.valid.serviceApps);

        const toDeploy: IKubeApplication[] = [];
        for (const appName of appNames) {
            const app = _.find(allApps, (ap) => ap.name === appName && ap.type === appType);
            if (!app) {
                throw new Error(`Not found: ${appName}`);
            }
            toDeploy.push(app);
        }

        for (const appId of appIds) {
            const app = _.find(allApps, (ap) => ap.id === appId && ap.type === appType);
            if (!app) {
                throw new Error(`Not found: ${appId}`);
            }
            toDeploy.push(app);
        }

        return toDeploy;
    }

    private async _deployApplications(apps: IKubeApplication[], envName?: string) {
        await this.api.walkApplications(apps, async (app) => {
            const envNameWithDef = envName || app.defaultEnvironment;

            logger.info(`Deploying ${app.name} on environment ${envNameWithDef || 'unknown'}`);
            await this.api.deployApplication(app, envName);
            logger.success(`Application deployed !\n`);

        });
    }

    private async _destroyApplications(apps: IKubeApplication[], envName?: string) {
        await this.api.walkApplications(apps, async (app) => {
            const envNameWithDef = envName || app.defaultEnvironment;

            logger.info(`Destroying ${app.name} on environment ${envNameWithDef || 'unknown'}`);
            await this.api.destroyApplication(app, envName);
            logger.success(`Application destroyed !\n`);

        });
    }

    private async _buildApplications(apps: IKubeApplication[]) {
        for (const app of apps) {
            if (app.docker) {
                logger.info('Building application ...');
                await this.api.buildApplication(app);
                logger.success('Done !');
            }
        }
    }

    private wait(timeSec: number): Promise<any> {
        return new Promise((r, j) => setTimeout(r, timeSec * 1000));
    }
}
