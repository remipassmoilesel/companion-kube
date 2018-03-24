#!/usr/bin/env node

import 'source-map-support/register';

import {Api} from './lib/Api';
import {Logger} from './lib/misc/Logger';
import {CliHandlers} from './lib/CliHandlers';
import {mainConfig} from './lib/main-config/config';

const logger = new Logger();
const api = new Api(mainConfig);
const cliHandlers = new CliHandlers(mainConfig, api);

logger.info('Companion-Kube !');
logger.info();

class Main {

    public run() {
        api.checkPrerequisites();
        cliHandlers.setupAndParse(process.argv);
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
