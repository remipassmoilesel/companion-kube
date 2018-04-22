#!/usr/bin/env node

import 'source-map-support/register';
import {Api} from './lib/Api';
import {Logger} from './lib/misc/Logger';
import {mainConfig} from './lib/main-config/config';
import {Cli} from './lib/Cli';
import {LogLevels} from './lib/misc/LogLevels';
import {CliDisplay} from './lib/cli/CliDisplay';
import {CommandExecutor} from './lib/misc/CommandExecutor';

(async () => {

    const cliDisplay = new CliDisplay();
    const onError = (e: Error) => {
        cliDisplay.logFatalError(e, mainConfig.debug);
        process.exit(1);
    };

    try {

        Logger.setLogLevel(mainConfig.debug ? LogLevels.debug : LogLevels.info);

        const commandExec = new CommandExecutor();
        const api = new Api(mainConfig, commandExec);
        const cli = new Cli(mainConfig, api, commandExec, onError);

        await cli.setupAndParse(process.argv);
    } catch (e) {
        onError(e);
    }

})();
