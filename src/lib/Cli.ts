import {IMainConfig} from './main-config/configTypes';
import {Api} from './Api';
import {CliHandlers} from './cli-handlers/CliHandlers';
import {Help} from './cli/Help';
import {AppType} from './app-config/appConfigTypes';
import {IApplicationArguments, IEnvironmentOptions, IRunArguments} from './cli/cliTypes';
import {IS_DEBUG} from '../main';
import {CliDisplay} from './cli/CliDisplay';

export class Cli {

    private mainConfig: IMainConfig;
    private handlers: CliHandlers;
    private api: Api;
    private cliProg: any;
    private cliDisplay = new CliDisplay();

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

        this.registerMiscCommands();
        this.registerServiceCommands();
        this.registerAppCommands();
    }

    public registerMiscCommands(){

        this.cliProg
            .command('init', 'Create a full ck-config.js example')
            .help(Help.init)
            .option('-f', 'Force if file already exists')
            .action(async (args: any, options: any) => {
                await this.catchHandlersErrors(async () => {
                    await this.handlers.miscHandlers.initDirectory(args, options);
                });
            });

        this.cliProg
            .command('list', 'List available applications')
            .help(Help.list)
            .action(async (args: IApplicationArguments, options: IEnvironmentOptions) => {
                await this.catchHandlersErrors(async () => {
                    await this.handlers.miscHandlers.listApplications(args, options);
                });
            });

        this.cliProg
            .command('build', 'Build one or more images of applications')
            .help(Help.build)
            .argument('[applications...]', 'Applications to build')
            .action(async (args: IApplicationArguments, options: IEnvironmentOptions) => {
                await this.catchHandlersErrors(async () => {
                    await this.handlers.miscHandlers.buildApplications(args, options);
                });
            });

        this.cliProg
            .command('run', 'Run script from ck-config.js')
            .help(Help.script)
            .argument('<script...>', 'Script to launch')
            .action(async (args: IRunArguments, options: IEnvironmentOptions) => {
                await this.catchHandlersErrors(async () => {
                    await this.handlers.miscHandlers.runScript(args, options);
                });
            });
    }

    public registerServiceCommands(){

        this.cliProg
            .command('svc deploy', 'Deploy one or more service applications')
            .help(Help.deployServices)
            .argument('<applications...>', 'Service applications to deploy')
            .option('-e <env>', 'Environment to execute action on')
            .complete(() => {
                return this.api.getValidAppConfigurationsAsString(process.cwd(), AppType.SERVICE);
            })
            .action(async (args: IApplicationArguments, options: IEnvironmentOptions) => {
                await this.catchHandlersErrors(async () => {
                    await this.handlers.appHandlers.deployApplications(AppType.SERVICE, args, options);
                });
            });

        this.cliProg
            .command('svc redeploy', 'Destroy then deploy one or more applications')
            .help(Help.redeployServices)
            .argument('<applications...>', 'Applications to deploy')
            .option('-e <env>', 'Environment to execute action on')
            .complete(() => {
                return this.api.getValidAppConfigurationsAsString(process.cwd(), AppType.SERVICE);
            })
            .action(async (args: IApplicationArguments, options: IEnvironmentOptions) => {
                await this.catchHandlersErrors(async () => {
                    await this.handlers.appHandlers.redeployApplications(AppType.SERVICE, args, options);
                });
            });

        this.cliProg
            .command('svc destroy', 'Destroy one or more service applications')
            .help(Help.destroyServices)
            .argument('<applications...>', 'Applications to destroy')
            .option('-e <env>', 'Environment to execute action on')
            .complete(() => {
                return this.api.getValidAppConfigurationsAsString(process.cwd(), AppType.SERVICE);
            })
            .action(async (args: IApplicationArguments, options: IEnvironmentOptions) => {
                await this.catchHandlersErrors(async () => {
                    await this.handlers.appHandlers.destroyApplications(AppType.SERVICE, args, options);
                });
            });

    }

    public registerAppCommands(){

        this.cliProg
            .command('deploy', 'Deploy one or more applications')
            .help(Help.deploy)
            .argument('[applications...]', 'Applications to deploy')
            .option('-e <env>', 'Environment to execute action on')
            .complete(() => {
                return this.api.getValidAppConfigurationsAsString(process.cwd(), AppType.APPLICATION);
            })
            .action(async (args: IApplicationArguments, options: IEnvironmentOptions) => {
                await this.catchHandlersErrors(async () => {
                    await this.handlers.appHandlers.deployApplications(AppType.APPLICATION, args, options);
                });
            });

        this.cliProg
            .command('redeploy', 'Destroy then deploy one or more applications')
            .help(Help.redeploy)
            .argument('[applications...]', 'Applications to deploy')
            .option('-e <env>', 'Environment to execute action on')
            .complete(() => {
                return this.api.getValidAppConfigurationsAsString(process.cwd(), AppType.APPLICATION);
            })
            .action(async (args: IApplicationArguments, options: IEnvironmentOptions) => {
                await this.catchHandlersErrors(async () => {
                    await this.handlers.appHandlers.redeployApplications(AppType.APPLICATION, args, options);
                });
            });

        this.cliProg
            .command('destroy', 'Destroy one or more applications')
            .help(Help.destroy)
            .argument('[applications...]', 'Applications to destroy')
            .option('-e <env>', 'Environment to execute action on')
            .complete(() => {
                return this.api.getValidAppConfigurationsAsString(process.cwd(), AppType.APPLICATION);
            })
            .action(async (args: IApplicationArguments, options: IEnvironmentOptions) => {
                await this.catchHandlersErrors(async () => {
                    await this.handlers.appHandlers.destroyApplications(AppType.APPLICATION, args, options);
                });
            });

    }

    private parse(argv: string[]) {
        this.cliProg.parse(argv);
    }

    // handlers errors are async
    private async catchHandlersErrors(cb: () => Promise<void>): Promise<void> {
        try {
            await cb();
        } catch (e) {
            this.cliDisplay.logFatalError(e, IS_DEBUG);
            process.exit(1);
        }
    }
}
