import * as _ from 'lodash';
import {IMainConfig} from '../main-config/configTypes';
import {Logger} from '../misc/Logger';
import {Api} from '../Api';
import {IDeployArguments, IDeployOptions} from './cliTypes';
import {IConfigValidationResult} from '../app-config/appConfigTypes';

const logger = new Logger();

export class CliHandlers {
    private mainConfig: IMainConfig;
    private api: Api;

    constructor(mainConfig: IMainConfig, api: Api) {
        this.mainConfig = mainConfig;
        this.api = api;
    }

    public listApplications(args: any, options: any) {
        this.showCliHeader();
        this.checkPrerequisites();

        const appConfigs = this.api.loadAppsConfiguration(process.cwd());
        this.showValidApps(appConfigs);
        this.showValidServiceComponents(appConfigs);

        if (appConfigs.invalid.length > 0) {
            this.showInvalidConfigurations(appConfigs);
            throw new Error('Invalid configuration');
        }
        else if (appConfigs.valid.apps.length > 0 || appConfigs.valid.service.length > 0) {
            logger.success('All configurations are valid !');
        }
    }

    public async deployApplications(args: IDeployArguments, options: IDeployOptions) {
        this.showCliHeader();
        this.checkPrerequisites();

        if (args.applications.indexOf('all') !== -1){
            await this.api.deployAllApplications(process.cwd(), options.e);
            return;
        }

        const {appNames, appNumbers} = this.getAppNumbersAndNames(args.applications);

        await this.api.deployApplications(process.cwd(), appNames, appNumbers, options.e);
    }

    public async destroyApplications(args: IDeployArguments, options: IDeployOptions) {
        this.showCliHeader();
        this.checkPrerequisites();

        if (args.applications.indexOf('all') !== -1){
            await this.api.destroyAllApplications(process.cwd(), options.e);
            return;
        }

        const {appNames, appNumbers} = this.getAppNumbersAndNames(args.applications);

        await this.api.destroyApplications(process.cwd(), appNames, appNumbers, options.e);
    }

    private checkPrerequisites() {
        const missingPrerequisites = this.api.getMissingPrerequisites();
        if (missingPrerequisites.length > 0) {
            _.forEach(missingPrerequisites, (missing) => {
                logger.error(`Missing prerequisite: ${missing.command}`);
                logger.info(`See: ${missing.installScript}`);
                logger.error();
            });

            logger.error(`You must install these tools before continue`);
            logger.error();

            throw new Error('Missing prerequisites');
        }
    }

    private showCliHeader() {
        logger.info('Companion-Kube !');
        logger.info();
    }

    private getAppNumbersAndNames(args: string[]){
        const appNames: string[] = [];
        const appNumbers: number[] = [];

        _.forEach(args, (app: any) => {
            isNaN(app) ? appNames.push(app) : appNumbers.push(Number(app));
        });

        return {appNames, appNumbers};
    }

    private showValidApps(appConfigs: IConfigValidationResult) {

        if (appConfigs.valid.apps.length > 0) {

            logger.info('Available applications:');
            _.forEach(appConfigs.valid.apps, (valid, index) => {
                logger.info(`  ${index} - ${valid.name}`);
            });
            logger.info();

        } else {
            logger.warning('No valid application found !');
            logger.warning();
        }

    }

    private showValidServiceComponents(appConfigs: IConfigValidationResult) {

        if (appConfigs.valid.service.length > 0) {

            logger.info('Service components:');
            _.forEach(appConfigs.valid.service, (valid, index) => {
                logger.info(`  ${index} - ${valid.name}`);
            });
            logger.info();

        } else {
            logger.warning('No valid service component found !');
            logger.warning();
        }

    }

    private showInvalidConfigurations(appConfigs: IConfigValidationResult) {
        _.forEach(appConfigs.invalid, (invalid) => {
            const errors: string[] = _.map(invalid.errors, (err) => err.message as string);

            logger.error(`Invalid configuration found: ${invalid.config.configPath}`);
            logger.error(`Errors: \n\t${errors.join(', \n\t')}`);
            logger.error();
        });
        logger.error(`You must fix this configurations before continue`);
    }
}
