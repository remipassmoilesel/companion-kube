import {IMainConfig} from './main-config/configTypes';
import {Api} from './Api';
import {CliHandlers} from './cli/CliHandlers';
import {Help} from './cli/Help';
import {Logger} from './misc/Logger';
import {logFatalError} from './misc/utils';
import {IS_DEBUG} from '../main';

const logger = new Logger();

export class Cli {

    private mainConfig: IMainConfig;
    private handlers: CliHandlers;
    private api: Api;
    private cliProg: any;

    constructor(mainConfig: IMainConfig, api: Api) {
        this.mainConfig = mainConfig;
        this.api = api;
        this.handlers = new CliHandlers(mainConfig, api);
        this.cliProg = require('caporal');
    }

    public setupAndParse(argv: string[]) {
        this.setupCli();
        this.parse(argv);
    }

    private setupCli() {

        this.cliProg
            .version(this.mainConfig.version)
            .help(Help.global);

        this.cliProg
            .command('init', 'Create a full ck-config.js example')
            .help(Help.list)
            .option('-f', 'Force if already exists')
            .action(this.bindHandler(this.handlers.initDirectory));

        this.cliProg
            .command('list', 'List available applications')
            .help(Help.list)
            .action(this.bindHandler(this.handlers.listApplications));

        this.cliProg
            .command('deploy', 'Deploy one or more applications')
            .help(Help.deploy)
            .argument('<applications...>', 'Applications to deploy')
            .option('-s', 'Deploy services')
            .option('-e <env>', 'Environment to execute action on')
            .complete(() => {
                return this.api.getValidAppConfigurationsAsString(process.cwd(), false);
            })
            .action(this.bindHandler(this.handlers.deployApplications));

        this.cliProg
            .command('destroy', 'Clean one or more applications')
            .help(Help.destroy)
            .argument('<applications...>', 'Applications to clean')
            .option('-e <env>', 'Environment to execute action on')
            .option('-s', 'Deploy services')
            .complete(() => {
                return this.api.getValidAppConfigurationsAsString(process.cwd(), false);
            })
            .action(this.bindHandler(this.handlers.destroyApplications));

        // this.cliProg
        //     .command('services deploy', 'Deploy one or more applications')
        //     .help(Help.deploy)
        //     .argument('<applications...>', 'Applications to deploy')
        //     .option('-s', 'Deploy services')
        //     .option('-e <env>', 'Environment to execute action on')
        //     .complete(() => {
        //         return this.api.getValidAppConfigurationsAsString(process.cwd(), true);
        //     })
        //     .action(this.bindHandler(this.handlers.deployServiceApplications));
        //
        // this.cliProg
        //     .command('services destroy', 'Clean one or more applications')
        //     .help(Help.destroy)
        //     .argument('<applications...>', 'Applications to clean')
        //     .option('-e <env>', 'Environment to execute action on')
        //     .option('-s', 'Deploy services')
        //     .complete(() => {
        //         return this.api.getValidAppConfigurationsAsString(process.cwd(), true);
        //     })
        //     .action(this.bindHandler(this.handlers.destroyServiceApplications));
    }

    private bindHandler(handler: (...args: any[]) => any) {
        return async (...args: any[]) => {
            try {
                await handler.apply(this.handlers, args);
            } catch (e) {
                logFatalError(logger, e, IS_DEBUG);
                process.exit(1);
            }
        };
    }

    private parse(argv: string[]) {
        this.cliProg.parse(argv);
    }

}
