import {IMainConfig} from './main-config/configTypes';
import {Api} from './Api';
import {CliHandlers} from './cli/CliHandlers';
import {Help} from './cli/Help';
import {Logger} from './misc/Logger';
import {AppType} from './app-config/appConfigTypes';
import {IDeployArguments, IDeployOptions} from './cli/cliTypes';

const logger = new Logger();

type ICliHandler = (...args: any[]) => any;

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
            .help(Help.init)
            .option('-f', 'Force if already exists')
            .action(async (args: any, options: any) => {
                await this.handlers.initDirectory(args, options);
            });

        this.cliProg
            .command('list', 'List available applications')
            .help(Help.list)
            .action(async (args: IDeployArguments, options: IDeployOptions) => {
                await this.handlers.listApplications(args, options);
            });

        this.cliProg
            .command('services deploy', 'Deploy one or more applications')
            .help(Help.deploy)
            .argument('<applications...>', 'Applications to deploy')
            .option('-s', 'Deploy services')
            .option('-e <env>', 'Environment to execute action on')
            .complete(() => {
                return this.api.getValidAppConfigurationsAsString(process.cwd(), AppType.SERVICE);
            })
            .action(async (args: IDeployArguments, options: IDeployOptions) => {
                await this.handlers.deployApplications(AppType.SERVICE, args, options);
            });

        this.cliProg
            .command('services destroy', 'Clean one or more applications')
            .help(Help.destroy)
            .argument('<applications...>', 'Applications to clean')
            .option('-e <env>', 'Environment to execute action on')
            .option('-s', 'Deploy services')
            .complete(() => {
                return this.api.getValidAppConfigurationsAsString(process.cwd(), AppType.SERVICE);
            })
            .action(async (args: IDeployArguments, options: IDeployOptions) => {
                await this.handlers.destroyApplications(AppType.SERVICE, args, options);
            });

        this.cliProg
            .command('deploy', 'Deploy one or more applications')
            .help(Help.deploy)
            .argument('<applications...>', 'Applications to deploy')
            .option('-s', 'Deploy services')
            .option('-e <env>', 'Environment to execute action on')
            .complete(() => {
                return this.api.getValidAppConfigurationsAsString(process.cwd(), AppType.APPLICATION);
            })
            .action(async (args: IDeployArguments, options: IDeployOptions) => {
                await this.handlers.deployApplications(AppType.APPLICATION, args, options);
            });

        this.cliProg
            .command('destroy', 'Clean one or more applications')
            .help(Help.destroy)
            .argument('<applications...>', 'Applications to clean')
            .option('-e <env>', 'Environment to execute action on')
            .option('-s', 'Deploy services')
            .complete(() => {
                return this.api.getValidAppConfigurationsAsString(process.cwd(), AppType.APPLICATION);
            })
            .action(async (args: IDeployArguments, options: IDeployOptions) => {
                await this.handlers.destroyApplications(AppType.APPLICATION, args, options);
            });

    }

    private parse(argv: string[]) {
        this.cliProg.parse(argv);
    }

}
