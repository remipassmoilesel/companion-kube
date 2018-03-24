import * as _ from 'lodash';

import {IMainConfig} from '../main-config/configTypes';
import {Logger} from '../misc/Logger';
import {PrerequisiteChecker} from '../commands/PrerequisiteChecker';
import {AppConfigurationManager} from '../app-config/AppConfigurationManager';

const logger = new Logger();

export class SetupHandlers {
    private mainConfig: IMainConfig;
    private prereqChecker: PrerequisiteChecker;
    private appConfigMan: AppConfigurationManager;

    constructor(mainConfig: IMainConfig) {
        this.mainConfig = mainConfig;
        this.prereqChecker = new PrerequisiteChecker(mainConfig);
        this.appConfigMan = new AppConfigurationManager(mainConfig);
    }

    public checkPrerequisites() {
        const missingPrerequisites = this.prereqChecker.getMissingPrerequisites();
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

    public loadAppConfigurations(targetDirectory: string) {
        const appConfigs = this.appConfigMan.loadAppConfigurations(targetDirectory);
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
    }

}
