import * as _ from 'lodash';
import {IMainConfig} from '../main-config/configTypes';
import {Logger} from '../misc/Logger';
import {Api} from '../Api';
import {IDeployArguments} from './cliTypes';

const logger = new Logger();

export class CliHandlers {
    private mainConfig: IMainConfig;
    private api: Api;

    constructor(mainConfig: IMainConfig, api: Api) {
        this.mainConfig = mainConfig;
        this.api = api;
    }

    public listApplications(args: any, options: any) {
        this.showHeader();
        this.checkPrerequisites();

        logger.info('Available applications:');

        const appConfigs = this.api.loadAppsConfiguration(process.cwd());
        if (appConfigs.valid.length > 0) {
            _.forEach(appConfigs.valid, (valid, index) => {
                logger.info(`  ${index} - ${valid.name}`);
            });
            logger.info();
        } else {
            logger.warning('No valid configuration found !');
            logger.warning();
        }

        if (appConfigs.invalid.length > 0) {
            _.forEach(appConfigs.invalid, (invalid) => {
                const errors: string[] = _.map(invalid.errors, (err) => err.message as string);

                logger.error(`Invalid configuration found: ${invalid.config.configPath}`);
                logger.error(`Errors: \n\t${errors.join(', \n\t')}`);
                logger.error();
            });
            logger.error(`You must fix this configurations before continue`);
            throw new Error('Invalid configuration');

        } else if (appConfigs.valid.length > 0) {
            logger.success('All configurations are valid !');
        }
    }

    public async deployApplications(args: IDeployArguments, options: any) {
        this.showHeader();
        this.checkPrerequisites();

        const {appNames, appNumbers} = this.getAppNumbersAndNames(args.applications);

        await this.api.deployApplications(process.cwd(), appNames, appNumbers);
    }

    public async destroyApplications(args: IDeployArguments, options: any) {
        this.showHeader();
        this.checkPrerequisites();

        const {appNames, appNumbers} = this.getAppNumbersAndNames(args.applications);

        await this.api.destroyApplications(process.cwd(), appNames, appNumbers);
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

    private getAppNumbersAndNames(args: string[]){
        const appNames: string[] = [];
        const appNumbers: number[] = [];

        _.forEach(args, (app: any) => {
            isNaN(app) ? appNames.push(app) : appNumbers.push(Number(app));
        });

        return {appNames, appNumbers};
    }
}
