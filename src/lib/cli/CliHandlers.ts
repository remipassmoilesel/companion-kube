import * as _ from 'lodash';
import {IMainConfig} from '../main-config/configTypes';
import {Logger} from '../misc/Logger';
import {Api} from '../Api';
import {IAppConfig} from '../app-config/appConfigTypes';

const logger = new Logger();

export class CliHandlers {
    private mainConfig: IMainConfig;
    private api: Api;

    constructor(mainConfig: IMainConfig, api: Api) {
        this.mainConfig = mainConfig;
        this.api = api;
    }

    public listApplications(args: any, options: any, logger: any) {
        this.showHeader();
        this.checkPrerequisites();

        logger.info("Command 'list' called with:");
        logger.info('arguments: %j', args);
        logger.info('options: %j', options);
    }

    public deployApplications(args: any, options: any, logger: any) {
        this.showHeader();
        this.checkPrerequisites();

        logger.info("Command 'deploy' called with:");
        logger.info('arguments: %j', args);
        logger.info('options: %j', options);
    }

    private loadAppConfigurations(targetDirectory: string): IAppConfig[] {
        const appConfigs = this.api.loadAppsConfiguration(targetDirectory);
        if (appConfigs.invalid.length > 0) {
            _.forEach(appConfigs.invalid, (invalid) => {

                const errors: string[] = _.map(invalid.errors, (err) => err.message as string);

                logger.error(`Invalid configuration found: ${invalid.config.configPath}`);
                logger.error(`Errors: \n\t${errors.join(', \n\t')}`);
                logger.error();
            });

            logger.error(`You must fix this configurations before continue`);
            logger.error();

            throw new Error('Invalid configuration');
        }
        return appConfigs.valid;
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

    private showHeader() {
        logger.info('Companion-Kube !');
        logger.info();
    }
}
