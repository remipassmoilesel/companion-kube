#!/usr/bin/env node

import 'source-map-support/register';

import {Api} from './lib/Api';
import {Logger} from './lib/misc/Logger';
import {mainConfig} from './lib/main-config/config';
import {Cli} from './lib/cli/Cli';

const logger = new Logger();
const api = new Api(mainConfig);
const cli = new Cli(mainConfig, api);

class Main {

    public run() {
        cli.setupAndParse(process.argv);
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
