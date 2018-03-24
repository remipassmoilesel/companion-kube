#!/usr/bin/env node

import 'source-map-support/register';

import {Logger} from './misc/Logger';
import {CliHandlers} from './handlers/CliHandlers';
import {SetupHandlers} from './handlers/SetupHandlers';
import {mainConfig} from './main-config/config';


const logger = new Logger();
const setupHandlers = new SetupHandlers(mainConfig);
const cliHandlers = new CliHandlers(mainConfig);

logger.info('Companion-Kube !');
logger.info();

class Main {

    public run(){
        setupHandlers.checkPrerequisites();
        setupHandlers.getApplicationConfigurations(process.cwd());
    }

    public exit(returnCode: number) {
        process.exit(returnCode);
    }
}

(async () => {

    try {
        new Main().run();
    } catch (e) {
        logger.error(`Fatal error: ${e.message}`, e.stack);
        process.exit(1);
    }

})();
