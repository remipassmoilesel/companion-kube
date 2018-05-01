import {IMainConfig} from './main-config/configTypes';
import {Api} from './Api';
import {CliHandlers} from './cli/handlers/CliHandlers';
import {Help} from './cli/Help';
import {AppType} from './app-config/appConfigTypes';
import {IApplicationArguments, IEnvironmentOptions, IRunArguments} from './cli/cliTypes';
import {CliDisplay} from './cli/CliDisplay';
import {CommandExecutor} from './misc/CommandExecutor';

export type IErrorHandler = (e: Error) => any;

export class Cli {

    private mainConfig: IMainConfig;
    private handlers: CliHandlers;
    private api: Api;
    private cliProg: any;
    private cliDisplay = new CliDisplay();
    private onError: IErrorHandler;

    constructor(mainConfig: IMainConfig, api: Api, commandExec: CommandExecutor, onError: IErrorHandler) {
        this.mainConfig = mainConfig;
        this.api = api;
        this.handlers = new CliHandlers(mainConfig, api, commandExec);
        this.cliProg = require('caporal'); // create a new instance of cli program
        this.onError = onError;
    }

    public setupAndParse(argv: string[]) {
        this.setupCli();
        return this.parse(argv);
    }

    private setupCli() {

        this.cliProg
            .version(this.mainConfig.version)
            .help(Help.global);

        this.registerMiscCommands();
        this.registerServiceCommands();
        this.registerClusterCommands();
        this.registerAppCommands();
    }

    public registerMiscCommands() {

        // default command, used to display help and exit with non zero code if no command is specified
        // or if command is incorrect
        this.cliProg
            .command('', '')
            .default()
            .action(async (args: any, options: any) => {
                await this.catchHandlersErrors(async () => {
                    await this.handlers.miscHandlers.throwErrorForMissingCommand();
                });
            });

        this.cliProg
            .command('init', 'Create a full ck-config.js example')
            .help(Help.init)
            .option('-f', 'Force creation. If file already exists it will be overwritten.')
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
            .command('push', 'Build one or more images of applications')
            .help(Help.push)
            .argument('[applications...]', 'Applications to build')
            .action(async (args: IApplicationArguments, options: IEnvironmentOptions) => {
                await this.catchHandlersErrors(async () => {
                    await this.handlers.miscHandlers.pushApplications(args, options);
                });
            });

        this.cliProg
            .command('build-push', 'Build and push one or more images of applications')
            .help(Help.push)
            .argument('[applications...]', 'Applications to build')
            .action(async (args: IApplicationArguments, options: IEnvironmentOptions) => {
                await this.catchHandlersErrors(async () => {
                    await this.handlers.miscHandlers.buildAndPushApplications(args, options);
                });
            });

        this.cliProg
            .command('run', 'Run script from ck-config.js')
            .help(Help.script)
            .argument('[script...]', 'Script to launch')
            .action(async (args: IRunArguments, options: IEnvironmentOptions) => {
                await this.catchHandlersErrors(async () => {
                    await this.handlers.miscHandlers.runScript(args, options);
                });
            });
    }

    public registerServiceCommands() {

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

    private registerClusterCommands() {

        this.cliProg
            .command('cluster deploy', 'Deploy Kubernetes cluster')
            .help(Help.deployCluster)
            .action(async (args: any, options: any) => {
                await this.catchHandlersErrors(async () => {
                    await this.handlers.appHandlers.deployApplications(AppType.CLUSTER, args, options);
                });
            });

        this.cliProg
            .command('cluster destroy', 'Destroy Kubernetes cluster')
            .help(Help.destroyCluster)
            .action(async (args: any, options: any) => {
                await this.catchHandlersErrors(async () => {
                    await this.handlers.appHandlers.destroyApplications(AppType.CLUSTER, args, options);
                });
            });

    }

    public registerAppCommands() {

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

    private async parse(argv: string[]) {
        await this.cliProg.parse(argv);
    }

    // handlers errors are async
    private async catchHandlersErrors(cb: () => Promise<void>): Promise<void> {
        try {
            await cb();
        } catch (e) {
            this.onError(e);
        }
    }

}
