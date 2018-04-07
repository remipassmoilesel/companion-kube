import * as _ from 'lodash';
import * as ajv from 'ajv';
import * as readline from 'readline';
import {IKubeApplication} from '../app-config/appConfigTypes';
import {Logger} from '../misc/Logger';
import {IPrerequisite} from '../prerequisites/prerequisites';
import {ICliOperation} from './CliOperations';
import {IInvalidApplication, IRecursiveLoadingResult} from '../app-config/configTypes';
import {IAppError, IAugmentedError} from '../misc/IAppError';
import {ILogLevel, LogLevels} from '../misc/LogLevels';

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
                this.showAppAsListItem(LogLevels.info, app);
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
            _.forEach(appConfigs.valid.serviceApps, (app: IKubeApplication) => {
                this.showAppAsListItem(LogLevels.info, app);
            });
            logger.info();

        } else {
            logger.warning('No valid service component found !');
            logger.warning();
        }

    }

    public showInvalidConfigurations(invalidApps: IInvalidApplication[]) {
        _.forEach(invalidApps, (invalid) => {
            logger.error(`Invalid configuration found: ${invalid.app.configPath}`);
            logger.error(`Errors: \n`);
            this.showValidationErrors(invalid.errors);
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
        log();

        _.forEach(apps, (app: IKubeApplication) => {
            this.showAppAsListItem(operation.level, app);
        });

        log();

        return this.waitForEnter('Press ENTER to confirm, or CTRL-C to cancel');
    }

    public logFatalError(e: IAugmentedError, debug: boolean) {

        logger.error();
        logger.error(`Fatal error: ${e.message}`, debug && e.stack);
        logger.error();

        if (e.$appErrors) {
            _.forEach(e.$appErrors, (appError: IAppError) => {
                logger.error(
                    `Application: ${appError.app.name} \n\tError: ${appError.error.message}`,
                    debug && appError.error.stack,
                );
                logger.error();
            });
        }

        if (e.$invalidApps) {
            this.showInvalidConfigurations(e.$invalidApps);
        }
    }

    public showScripts(appConfig: IKubeApplication) {
        logger.info();
        logger.info(`Application: ${appConfig.name}`);
        logger.info();

        if (!appConfig.scripts){
            logger.warning('No scripts found here !');
            return;
        }

        const keys = Object.keys(appConfig.scripts);
        for (const scriptName of keys){
            logger.info(`\t - ${scriptName.padEnd(20)}:   ${appConfig.scripts[scriptName]}`);
        }
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

    private showValidationErrors(errors: ajv.ErrorObject[]) {
        for (const err of errors) {
            let message = `\tField: ${err.dataPath || 'root'}`;
            message += `\n\tError: ${err.keyword.toLocaleUpperCase()} - ${err.message}\n`;
            logger.error(message);
        }
    }

    private showAppAsListItem(level: ILogLevel, app: IKubeApplication) {
        const log = (message?: string) => {
            logger.printColor(level, message);
        };
        const id = app.id < 10 ? 0 + String(app.id) : String(app.id);
        log(`\t- #${id} ${app.name}: ${app.applicationStructure}`);
    }

}
