import * as _ from 'lodash';
import {execSync} from 'child_process';
import {IMainConfig} from '../main-config/configTypes';
import {Logger} from '../misc/Logger';
import {Api} from '../Api';
import {IDeployArguments, IDeployOptions, IInitOptions, IRunArguments} from './cliTypes';
import {CliDisplay} from './CliDisplay';
import {AppType, IKubeApplication} from '../app-config/appConfigTypes';
import {ScriptRunner} from '../misc/ScriptRunner';

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

        const {apps} = await this.selectAppAndShowWarning(AppType.ALL, args, options);

        await this.api.buildApplications(apps);

    }

    public async deployApplications(appType: AppType, args: IDeployArguments, options: IDeployOptions) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        const {apps, envName} = await this.selectAppAndShowWarning(appType, args, options);

        await this.api.buildApplications(apps);

        await this.api.deployApplications(apps, envName);
    }

    public async redeployApplications(appType: AppType, args: IDeployArguments, options: IDeployOptions) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        const {apps, envName} = await this.selectAppAndShowWarning(appType, args, options);

        try {
            await this.api.destroyApplications(apps, envName);
        } catch (e) {
            logger.error('Cleaning did not go well ...');
        }

        await this.api.buildApplications(apps);

        await this.api.deployApplications(apps, envName);
    }

    public async destroyApplications(appType: AppType, args: IDeployArguments, options: IDeployOptions) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        const {apps, envName} = await this.selectAppAndShowWarning(appType, args, options);

        await this.api.destroyApplications(apps, envName);
    }

    private checkPrerequisites() {
        const missingPrerequisites = this.api.getMissingPrerequisites();
        if (missingPrerequisites.length > 0) {
            this.display.showMissingPrerequisites(missingPrerequisites);
            throw new Error('Missing prerequisites');
        }
    }

    private async selectAppAndShowWarning(appType: AppType, args: IDeployArguments, options?: IDeployOptions) {
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
            apps = this.getAppConfigs(targetDir, appNames, appIds);
        }

        await this.display.showWarningOnApps(apps, envName);

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

    private getAppConfigs(targetDir: string, appNames: string[], appIds: number[]): IKubeApplication[] {
        const configurations = this.api.loadAppsConfigurationRecursively(targetDir);

        const toDeploy: IKubeApplication[] = [];
        for (const appName of appNames) {
            const app = _.find(configurations.valid.apps, (ap) => ap.name === appName);
            if (!app) {
                throw new Error(`Not found: ${appName}`);
            }
            toDeploy.push(app);
        }

        for (const appNumber of appIds) {
            const app = _.find(configurations.valid.apps, (ap, index) => index === appNumber);
            if (!app) {
                throw new Error(`Not found: ${appNumber}`);
            }
            toDeploy.push(app);
        }

        return toDeploy;
    }

}
