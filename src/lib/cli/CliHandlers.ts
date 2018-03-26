import * as _ from 'lodash';
import {IMainConfig} from '../main-config/configTypes';
import {Logger} from '../misc/Logger';
import {Api} from '../Api';
import {IDeployArguments, IDeployOptions, IInitOptions} from './cliTypes';
import {CliDisplay} from './CliDisplay';
import {IKubeApplication} from '../app-config/appConfigTypes';

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
        else if (appConfigs.valid.apps.length > 0 || appConfigs.valid.services.length > 0) {
            logger.success('All configurations are valid !');
        }
    }

    public async deployApplications(args: IDeployArguments, options: IDeployOptions) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        const useServiceApps: boolean | undefined = options.s;
        const envName: string | undefined = options.e;

        const targetDir = process.cwd();
        const {appNames, appIds} = this.getAppNumbersAndNames(args.applications);

        let apps: IKubeApplication[];

        if (args.applications.indexOf('all') !== -1) {
            apps = this.api.getAllAppsConfigs(targetDir);
        } else {
            apps = this.api.getAppConfigs(targetDir, appNames, appIds);
        }

        // remove service apps if not needed
        if (!useServiceApps){
            _.remove(apps, (app) => app.serviceComponent);
        }

        await this.display.showWarningOnApps(apps, envName);

        await this.api.deployApplications(apps, envName);
    }

    public async destroyApplications(args: IDeployArguments, options: IDeployOptions) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        const useServiceApps: boolean | undefined = options.s;
        const envName: string | undefined = options.e;

        const targetDir = process.cwd();
        const {appNames, appIds} = this.getAppNumbersAndNames(args.applications);

        let apps: IKubeApplication[];

        if (args.applications.indexOf('all') !== -1) {
            apps = this.api.getAllAppsConfigs(targetDir);
        } else {
            apps = this.api.getAppConfigs(targetDir, appNames, appIds);
        }

        // remove service apps if not needed
        if (!useServiceApps){
            _.remove(apps, (app) => app.serviceComponent);
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

}
