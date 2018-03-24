#!/usr/bin/env node

import 'source-map-support/register';

import {Api} from './lib/Api';
import {Logger} from './lib/misc/Logger';
import {mainConfig} from './lib/main-config/config';
import {Cli} from './lib/cli/Cli';

const logger = new Logger();
const api = new Api(mainConfig);
const cli = new Cli(mainConfig, api);

const debug = false;

(async () => {

    try {
        cli.setupAndParse(process.argv);
    } catch (e) {
        logger.error(`Fatal error: ${e.message}`, debug && e.stack);
        process.exit(1);
    }

})();
