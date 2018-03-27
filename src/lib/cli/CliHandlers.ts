import * as _ from 'lodash';
import {IMainConfig} from '../main-config/configTypes';
import {Logger} from '../misc/Logger';
import {Api} from '../Api';
import {IDeployArguments, IDeployOptions, IInitOptions} from './cliTypes';
import {CliDisplay} from './CliDisplay';
import {AppType, IKubeApplication} from '../app-config/appConfigTypes';

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

    public listApplications(args: any, options: any) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        const appConfigs = this.api.loadAppsConfiguration(process.cwd());
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

    public async deployApplications(appType: AppType, args: IDeployArguments, options: IDeployOptions) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        const envName: string | undefined = options.e;
        const getAllConfig = args.applications.indexOf('all') !== -1;

        const targetDir = process.cwd();
        const {appNames, appIds} = this.getAppNumbersAndNames(args.applications);

        let apps: IKubeApplication[];

        if (getAllConfig) {
            apps = this.api.getAllAppsConfigs(targetDir, appType);
        } else {
            apps = this.getAppConfigs(targetDir, appNames, appIds);
        }

        await this.display.showWarningOnApps(apps, envName);

        await this.api.deployApplications(apps, envName);
    }

    public async destroyApplications(appType: AppType, args: IDeployArguments, options: IDeployOptions) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        console.log('args')
        console.log(args)

        const envName: string | undefined = options.e;
        const getAllConfig = args.applications.indexOf('all') !== -1;

        const targetDir = process.cwd();
        const {appNames, appIds} = this.getAppNumbersAndNames(args.applications);

        let apps: IKubeApplication[];

        if (getAllConfig) {
            apps = this.api.getAllAppsConfigs(targetDir, appType);
        } else {
            apps = this.getAppConfigs(targetDir, appNames, appIds);
        }

        await this.display.showWarningOnApps(apps, envName);

        await this.api.destroyApplications(apps, envName);
    }

    private checkPrerequisites() {
        const missingPrerequisites = this.api.getMissingPrerequisites();
        if (missingPrerequisites.length > 0) {
            this.display.showMissingPrerequisites(missingPrerequisites);
            throw new Error('Missing prerequisites');
        }
    }

    private getAppNumbersAndNames(args: string[]) {
        const appNames: string[] = [];
        const appIds: number[] = [];

        _.forEach(args, (app: any) => {
            isNaN(app) ? appNames.push(app) : appIds.push(app.id);
        });

        return {appNames, appIds};
    }


    private getAppConfigs(targetDir: string, appNames: string[], appIds: number[]): IKubeApplication[] {
        const configurations = this.api.loadAppsConfiguration(targetDir);

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
