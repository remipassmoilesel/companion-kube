import * as _ from 'lodash';
import {IConfigValidationResult, IKubeApplication} from '../app-config/appConfigTypes';
import {Logger} from '../misc/Logger';
import {IPrerequisite} from '../prerequisites/prerequisites';
import {log} from 'util';
const logger = new Logger();

export class CliDisplay {
    private waitingTime: number = 600;

    public showCliHeader() {
        logger.info('Companion-Kube !');
        logger.info();
    }

    public showValidApps(appConfigs: IConfigValidationResult) {

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

    public showValidServiceComponents(appConfigs: IConfigValidationResult) {

        if (appConfigs.valid.services.length > 0) {

            logger.info('Service components:');
            _.forEach(appConfigs.valid.services, (valid, index) => {
                logger.info(`  ${index} - ${valid.name}`);
            });
            logger.info();

        } else {
            logger.warning('No valid service component found !');
            logger.warning();
        }

    }

    public showInvalidConfigurations(appConfigs: IConfigValidationResult) {
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

    public showWarningOnApps(apps: IKubeApplication[], envName: string | undefined) {
        logger.warning(`On environment: ${envName}`);
        logger.warning('The following applications will be concerned: ');
        _.forEach(apps, (app) => {
            logger.warning(`\t - #${app.id} - ${app.name}: ${app.projectType}`);
        });
        logger.warning(`Press CTRL C to cancel ...`);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, this.waitingTime);
        });
    }
}
