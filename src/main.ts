#!/usr/bin/env node

import 'source-map-support/register';
import {Api} from './lib/Api';
import {Logger} from './lib/misc/Logger';
import {mainConfig} from './lib/main-config/config';
import {Cli} from './lib/Cli';
import {LogLevels} from './lib/misc/LogLevels';
import {CliDisplay} from './lib/cli/CliDisplay';
import {CommandExecutor} from './lib/misc/CommandExecutor';

export const IS_DEBUG = false;
Logger.setDefaultLogLevel(IS_DEBUG ? LogLevels.debug : LogLevels.info);

const commandExec = new CommandExecutor();
const api = new Api(mainConfig, commandExec);
const cli = new Cli(mainConfig, api, commandExec);
const cliDisplay = new CliDisplay();

(async () => {

    try {
        await cli.setupAndParse(process.argv);
    } catch (e) {
        cliDisplay.logFatalError(e, IS_DEBUG);
        process.exit(1);
    }

})();
