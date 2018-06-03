import {IMainConfig} from './main-config/configTypes';
import {Api} from './Api';
import {CliHandlers} from './cli/handlers/CliHandlers';
import {ICliForceEnvOptions} from './cli/cliTypes';
import {CommandExecutor} from './utils/CommandExecutor';
import {AppType} from './app-config/appConfigTypes';
import {CliParser} from './cli/parser/CliParser';
import {CliOption} from './cli/parser/CliOption';
import {CliCommand, IParsedArguments} from './cli/parser/CliCommand';

export type IErrorHandler = (e: Error) => any;

export class Cli {

    private mainConfig: IMainConfig;
    private handlers: CliHandlers;
    private api: Api;
    private onError: IErrorHandler;
    private parser: CliParser;
    private commands: CliCommand[];

    constructor(mainConfig: IMainConfig, api: Api, commandExec: CommandExecutor, onError: IErrorHandler) {
        this.mainConfig = mainConfig;
        this.api = api;
        this.handlers = new CliHandlers(mainConfig, api, commandExec);
        this.onError = onError;
        this.parser = new CliParser();
        this.commands = [];
    }

    public async parseArguments(argv: string[]): Promise<void> {
        try {
            await this.parser.parse(argv.slice(2));
        } catch (e) {
            this.onError(e);
        }
    }

    public setupParser() {

        const envOption = new CliOption('environment', 'e', 'string', 'Environment name to use');

        this.commands.push(
            new CliCommand('help', 'Show help',
                async (command: CliCommand, args: IParsedArguments) => {
                    await this.handlers.miscHandlers.showHelp(args, this.commands);
                }));

        this.commands.push(
            new CliCommand('init', 'Create a full ck-config.js example',
                async (command: CliCommand, args: IParsedArguments) => {
                    await this.handlers.miscHandlers.initDirectory(args as ICliForceEnvOptions);
                }).addOption(new CliOption('force', 'f',
                'boolean', 'Force initialization even if file already exists')),
        );

        this.commands.push(
            new CliCommand('list', 'List available applications',
                async () => {
                    await this.handlers.miscHandlers.listApplications();
                }));

        this.commands.push(
            new CliCommand('build', 'Build one or more images of applications',
                async (command: CliCommand, args: IParsedArguments) => {
                    await this.handlers.miscHandlers.buildApplications(args);
                }));

        this.commands.push(
            new CliCommand('build-push', 'Build and push one or more images of applications',
                async (command: CliCommand, args: IParsedArguments) => {
                    await this.handlers.miscHandlers.buildAndPushApplications(args);
                }));

        this.commands.push(
            new CliCommand('run', 'Run a script from ck-config.js',
                async (command: CliCommand, args: IParsedArguments) => {
                    await this.handlers.miscHandlers.runScript(args);
                }),
        );

        this.commands.push(
            new CliCommand('svc deploy', 'Deploy one or more service applications',
                async (command: CliCommand, args: IParsedArguments) => {
                    // TODO: restore completion:
                    // return this.api.getValidAppConfigurationsAsString(process.cwd(), AppType.SERVICE);
                    await this.handlers.appHandlers.deployApplications(AppType.SERVICE, args);
                }).addOption(envOption),
        );

        this.commands.push(
            new CliCommand('svc redeploy', 'Destroy then deploy one or more service applications',
                async (command: CliCommand, args: IParsedArguments) => {
                    // TODO: restore completion:
                    // return this.api.getValidAppConfigurationsAsString(process.cwd(), AppType.SERVICE);
                    await this.handlers.appHandlers.redeployApplications(AppType.SERVICE, args);
                }).addOption(envOption),
        );

        this.commands.push(
            new CliCommand('svc destroy', 'Destroy one or more service applications',
                async (command: CliCommand, args: IParsedArguments) => {
                    // TODO: restore completion:
                    // return this.api.getValidAppConfigurationsAsString(process.cwd(), AppType.SERVICE);
                    await this.handlers.appHandlers.destroyApplications(AppType.SERVICE, args);
                }).addOption(envOption),
        );

        this.commands.push(
            new CliCommand('deploy', 'Deploy one or more applications',
                async (command: CliCommand, args: IParsedArguments) => {
                    // TODO: restore completion:
                    // return this.api.getValidAppConfigurationsAsString(process.cwd(), AppType.NORMAL);
                    await this.handlers.appHandlers.deployApplications(AppType.NORMAL, args);
                }).addOption(envOption),
        );

        this.commands.push(
            new CliCommand('redeploy', 'Destroy then deploy one or more applications',
                async (command: CliCommand, args: IParsedArguments) => {
                    // TODO: restore completion:
                    // return this.api.getValidAppConfigurationsAsString(process.cwd(), AppType.NORMAL);
                    await this.handlers.appHandlers.redeployApplications(AppType.NORMAL, args);
                }).addOption(envOption),
        );

        this.commands.push(
            new CliCommand('destroy', 'Destroy one or more applications',
                async (command: CliCommand, args: IParsedArguments) => {
                    // TODO: restore completion:
                    // return this.api.getValidAppConfigurationsAsString(process.cwd(), AppType.NORMAL);
                    await this.handlers.appHandlers.destroyApplications(AppType.NORMAL, args);
                }).addOption(envOption),
        );

        this.commands.push(
            new CliCommand('cluster deploy', 'Deploy a Kubernetes cluster',
                async (command: CliCommand, args: IParsedArguments) => {
                    await this.handlers.appHandlers.deployApplications(AppType.CLUSTER, args);
                }).addOption(envOption),
        );

        this.commands.push(
            new CliCommand('cluster destroy', 'Destroy a Kubernetes cluster',
                async (command: CliCommand, args: IParsedArguments) => {
                    await this.handlers.appHandlers.destroyApplications(AppType.CLUSTER, args);
                }).addOption(envOption),
        );

        this.parser.addAllCommands(this.commands);

    }

}
