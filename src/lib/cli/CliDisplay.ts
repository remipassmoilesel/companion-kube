import * as _ from 'lodash';
import * as readline from 'readline';
import {IKubeApplication, IRecursiveLoadingResult} from '../app-config/appConfigTypes';
import {Logger} from '../misc/Logger';
import {IPrerequisite} from '../prerequisites/prerequisites';
import {log} from 'util';
import {ICliOperation} from './cliTypes';

const logger = new Logger();

export class CliDisplay {

    public showCliHeader() {
        logger.info('Companion-Kube !');
        logger.info();
    }

    public showValidApps(appConfigs: IRecursiveLoadingResult) {

        if (appConfigs.valid.apps.length > 0) {

            logger.info('Available applications:');
            _.forEach(appConfigs.valid.apps, (app) => {
                logger.info(`  ${app.id} - ${app.name}`);
            });
            logger.info();

        } else {
            logger.warning('No valid application found !');
            logger.warning();
        }

    }

    public showValidServiceComponents(appConfigs: IRecursiveLoadingResult) {

        if (appConfigs.valid.serviceApps.length > 0) {

            logger.info('Service components:');
            _.forEach(appConfigs.valid.serviceApps, (valid, index) => {
                logger.info(`  ${index} - ${valid.name}`);
            });
            logger.info();

        } else {
            logger.warning('No valid service component found !');
            logger.warning();
        }

    }

    public showInvalidConfigurations(appConfigs: IRecursiveLoadingResult) {
        _.forEach(appConfigs.invalid, (invalid) => {
            const errors: string[] = _.map(invalid.errors, (err) => err.message as string);

            logger.error(`Invalid configuration found: ${invalid.config.configPath}`);
            logger.error(`Errors: \n\t${errors.join(', \n\t')}`);
            logger.error();
        });
        logger.error(`You must fix this configurations before continue`);
    }

    public showMissingPrerequisites(missingPrerequisites: IPrerequisite[]) {
        _.forEach(missingPrerequisites, (missing) => {
            logger.error(`Missing prerequisite: ${missing.command}`);
            logger.info(`See: ${missing.installScript}`);
            logger.error();
        });

        logger.error(`You must install these tools before continue`);
        logger.error();
    }

    public async showWarningOnApps(operation: ICliOperation, apps: IKubeApplication[],
                                   envName: string | undefined): Promise<any> {

        const log = (message?: string) => {
            logger.printColor(operation.level, message);
        };

        log(`Operation: ${operation.name}`);
        log(`On environment: ${envName || 'unknown'}`);
        log();
        log(`The following applications will be concerned: `);
        _.forEach(apps, (app: IKubeApplication) => {
            log(`\t - #${app.id} - ${app.name}: ${app.applicationStructure}`);
        });
        log();

        return this.waitForEnter('Press ENTER to confirm, or CTRL-C to cancel');
    }

    private waitForEnter(message: string) {
        return new Promise((resolve, reject) => {

            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });

            logger.question(message);

            rl.question('', (answer: string) => {
                resolve();
                rl.close();
            });

        });
    }

}
