import * as _ from 'lodash';
import {IMainConfig} from '../main-config/configTypes';
import {Logger} from '../misc/Logger';
import {Api} from '../Api';
import {IDeployArguments, IDeployOptions} from './cliTypes';
import {CliDisplay} from './CliDisplay';

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
        else if (appConfigs.valid.apps.length > 0 || appConfigs.valid.service.length > 0) {
            logger.success('All configurations are valid !');
        }
    }

    public async deployApplications(args: IDeployArguments, options: IDeployOptions) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        if (args.applications.indexOf('all') !== -1) {
            await this.api.deployAllApplications(process.cwd(), options.e);
            return;
        }

        const {appNames, appNumbers} = this.getAppNumbersAndNames(args.applications);

        await this.api.deployApplications(process.cwd(), appNames, appNumbers, options.e);
    }

    public async destroyApplications(args: IDeployArguments, options: IDeployOptions) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        if (args.applications.indexOf('all') !== -1) {
            await this.api.destroyAllApplications(process.cwd(), options.e);
            return;
        }

        const {appNames, appNumbers} = this.getAppNumbersAndNames(args.applications);

        await this.api.destroyApplications(process.cwd(), appNames, appNumbers, options.e);
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
        const appNumbers: number[] = [];

        _.forEach(args, (app: any) => {
            isNaN(app) ? appNames.push(app) : appNumbers.push(Number(app));
        });

        return {appNames, appNumbers};
    }

}
