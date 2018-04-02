import * as _ from 'lodash';
import {IApplicationArguments, IEnvironmentOptions} from '../cli/cliTypes';
import {AppType, IKubeApplication} from '../app-config/appConfigTypes';
import {IMainConfig} from '../main-config/configTypes';
import {Api} from '../Api';
import {CliDisplay} from '../cli/CliDisplay';
import {Logger} from '../misc/Logger';
import {walkApplications} from '../misc/utils';

export class AbstractCliHandlersGroup {

    protected logger = new Logger();
    protected mainConfig: IMainConfig;
    protected api: Api;
    protected display: CliDisplay;

    constructor(mainConfig: IMainConfig, api: Api) {
        this.mainConfig = mainConfig;
        this.api = api;
        this.display = new CliDisplay();
    }

    protected checkPrerequisites() {
        const missingPrerequisites = this.api.getMissingPrerequisites();
        if (missingPrerequisites.length > 0) {
            this.display.showMissingPrerequisites(missingPrerequisites);
            throw new Error('Missing prerequisites');
        }
    }

    protected async selectApps(appType: AppType, args: IApplicationArguments, options?: IEnvironmentOptions) {
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

    protected getAppNamesAndIds(args: string[]) {
        const appNames: string[] = [];
        const appIds: number[] = [];

        _.forEach(args, (app: any) => {
            isNaN(app) ? appNames.push(app) : appIds.push(app.id);
        });

        return {appNames, appIds};
    }

    protected getAppConfigs(targetDir: string, appType: AppType, appNames: string[],
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

    protected async _deployApplications(apps: IKubeApplication[], envName?: string) {
        await walkApplications(apps, async (app) => {
            const envNameWithDef = envName || app.defaultEnvironment;

            this.logger.info(`Deploying ${app.name} on environment ${envNameWithDef || 'unknown'}`);
            await this.api.deployApplication(app, envNameWithDef);
            this.logger.success(`Application deployed !\n`);

        });
    }

    protected async _destroyApplications(apps: IKubeApplication[], envName?: string) {
        await walkApplications(apps, async (app) => {
            const envNameWithDef = envName || app.defaultEnvironment;

            this.logger.info(`Destroying ${app.name} on environment ${envNameWithDef || 'unknown'}`);
            await this.api.destroyApplication(app, envNameWithDef);
            this.logger.success(`Application destroyed !\n`);

        });
    }

    protected async _buildApplications(apps: IKubeApplication[]) {
        for (const app of apps) {
            if (app.docker) {
                this.logger.info('Building application ...');
                await this.api.buildApplication(app);
                this.logger.success('Done !');
            }
        }
    }

    protected wait(timeSec: number): Promise<any> {
        return new Promise((r, j) => setTimeout(r, timeSec * 1000));
    }
}
