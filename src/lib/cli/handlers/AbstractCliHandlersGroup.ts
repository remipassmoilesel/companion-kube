import * as _ from 'lodash';
import {ICliApplicationsArguments} from '../cliTypes';
import {AppType, IKubeApplication} from '../../app-config/appConfigTypes';
import {IMainConfig} from '../../main-config/configTypes';
import {Api} from '../../Api';
import {CliDisplay} from '../CliDisplay';
import {Logger} from '../../log/Logger';
import {walkApplications} from '../../utils/utils';
import {CommandExecutor} from '../../utils/CommandExecutor';
import {AppConfigHelpers} from '../../app-config/AppConfigHelpers';

export class AbstractCliHandlersGroup {

    protected logger = new Logger();
    protected mainConfig: IMainConfig;
    protected commandExec: CommandExecutor;
    protected api: Api;
    protected display: CliDisplay;

    constructor(mainConfig: IMainConfig, api: Api, commandExec: CommandExecutor, cliDisplay: CliDisplay) {
        this.mainConfig = mainConfig;
        this.api = api;
        this.commandExec = commandExec;
        this.display = cliDisplay;
    }

    protected checkPrerequisites() {
        const missingPrerequisites = this.api.getMissingPrerequisites();
        if (missingPrerequisites.length > 0) {
            this.display.showMissingPrerequisites(missingPrerequisites);
            throw new Error('Missing prerequisites');
        }
    }

    // TODO: simplify after end of tests, improve selection
    protected async selectApps(appType: AppType, args: ICliApplicationsArguments) {
        const envName: string | undefined = args.environment || undefined;
        const getAllConfig = args.remainingArguments && args.remainingArguments.indexOf('all') !== -1;
        const targetDir = process.cwd();

        const {appNames, appIds} = await this.getAppNamesAndIds(args.remainingArguments);

        let apps: IKubeApplication[];

        if (getAllConfig) {
            apps = await this.api.getAllAppsConfigs(targetDir, appType);
        }

        else if (appType !== AppType.CLUSTER && !appNames.length && !appIds.length) {
            apps = [await this.api.loadAppConfiguration(targetDir)];
        }

        else if (appType === AppType.CLUSTER && !appNames.length && !appIds.length) {
            apps = await this.api.getAllAppsConfigs(targetDir, appType);
        }

        else {
            apps = await this.getAppConfigs(targetDir, appType, appNames, appIds);
        }

        return {apps, envName};
    }

    protected async getAppConfigs(targetDir: string, appType: AppType, appNames: string[],
                                  appIds: number[]): Promise<IKubeApplication[]> {

        const configurations = await this.api.loadAppsConfigurationRecursively(targetDir);
        // console.log(JSON.stringify(configurations, null, 2))
        const allApps = configurations.valid.apps.concat(configurations.valid.serviceApps);

        const selectedApps: IKubeApplication[] = [];
        for (const appName of appNames) {
            const app = _.find(allApps, (ap: IKubeApplication) => {
                return ap.name === appName && AppConfigHelpers.isType(ap, appType);
            });
            if (!app) {
                throw new Error(`Application not found: ${appName}. Is it a service application ?`);
            }
            selectedApps.push(app);
        }

        for (const appId of appIds) {
            const app = _.find(allApps, (ap: IKubeApplication) => {
                return ap.id === appId && AppConfigHelpers.isType(ap, appType);
            });
            if (!app) {
                throw new Error(`Application not found: ${appId}. Is it a service application ?`);
            }
            selectedApps.push(app);
        }

        return selectedApps;
    }

    protected getAppNamesAndIds(args: string[]) {
        const appNames: string[] = [];
        const appIds: number[] = [];

        _.forEach(args, (app: string) => {
            isNaN((app as any)) ? appNames.push(String(app)) : appIds.push(Number(app));
        });

        return {appNames, appIds};
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
            if (app.dockerImages) {
                this.logger.info(`Building application: ${app.rootPath}`);
                await this.api.buildApplication(app);
                this.logger.success('Done !');
            }
        }
    }

    protected async _pushApplications(apps: IKubeApplication[]) {
        for (const app of apps) {
            if (app.dockerImages) {
                this.logger.info(`Pushing image for project: ${app.rootPath}`);
                await this.api.pushApplication(app);
                this.logger.success('Done !');
            }
        }
    }

    protected wait(timeSec: number): Promise<any> {
        const timeMs = timeSec * 1000;

        this.logger.info(`Waiting ${timeSec} seconds ...`);
        this.logger.info();

        return new Promise((r, j) => setTimeout(r, timeMs));
    }
}
