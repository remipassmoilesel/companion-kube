#!/usr/bin/env node

import 'source-map-support/register';
import {Api} from './lib/Api';
import {Logger} from './lib/misc/Logger';
import {mainConfig} from './lib/main-config/config';
import {Cli} from './lib/Cli';
import {LogLevels} from './lib/misc/LogLevels';
import {logFatalError} from './lib/misc/utils';

export const IS_DEBUG = true;
Logger.setDefaultLogLevel(IS_DEBUG ? LogLevels.debug : LogLevels.info);

const logger = new Logger();
const api = new Api(mainConfig);
const cli = new Cli(mainConfig, api);


(async () => {

    try {
        cli.setupAndParse(process.argv);
    } catch (e) {
        logFatalError(logger, e, IS_DEBUG);
        process.exit(1);
    }

})();
