#!/usr/bin/env node

import {Logger, LogLevels} from './misc/Logger';
import {CliActions} from './CliActions';
import {mainConfig} from './config/config';

import 'source-map-support/register';

const logger = new Logger();
const cliActions = new CliActions(mainConfig);

logger.info('Companion-Kube !');
logger.info();

(async () => {

    try {
        cliActions.checkPrerequisites();

    } catch (e) {
        logger.error('Error: ', e);
        process.exit(1);
    }

})();
