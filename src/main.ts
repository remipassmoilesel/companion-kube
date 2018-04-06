#!/usr/bin/env node

import 'source-map-support/register';
import {Api} from './lib/Api';
import {Logger} from './lib/misc/Logger';
import {mainConfig} from './lib/main-config/config';
import {Cli} from './lib/Cli';
import {LogLevels} from './lib/misc/LogLevels';
import {CliDisplay} from './lib/cli/CliDisplay';

export const IS_DEBUG = false;
Logger.setDefaultLogLevel(IS_DEBUG ? LogLevels.debug : LogLevels.info);

const logger = new Logger();
const api = new Api(mainConfig);
const cli = new Cli(mainConfig, api);
const cliDisplay = new CliDisplay();

(async () => {

    try {
        cli.setupAndParse(process.argv);
    } catch (e) {
        cliDisplay.logFatalError(logger, e, IS_DEBUG);
        process.exit(1);
    }

})();
