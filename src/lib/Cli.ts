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

    constructor(mainConfig: IMainConfig, api: Api, commandExec: CommandExecutor, onError: IErrorHandler) {
        this.mainConfig = mainConfig;
        this.api = api;
        this.handlers = new CliHandlers(mainConfig, api, commandExec);
        this.onError = onError;
        this.parser = new CliParser();
    }

    public async setupAndParse(argv: string[]): Promise<void> {
        try {
            this.setupParser();
            await this.parser.parse(argv.slice(2));
        } catch (e) {
            this.onError(e);
        }
    }

    private setupParser() {

        const envOption = new CliOption('environment', 'e', 'string', 'Environment name to use');

        this.parser.addCommand(
            new CliCommand('init', 'Create a full ck-config.js example',
                [new CliOption('force', 'f', 'boolean', 'Force initialization even if file already exists')],
                async (command: CliCommand, args: IParsedArguments) => {
                    await this.handlers.miscHandlers.initDirectory(args as ICliForceEnvOptions);
                }));

        this.parser.addCommand(
            new CliCommand('list', 'List available applications', [],
                async () => {
                    await this.handlers.miscHandlers.listApplications();
                }));

        this.parser.addCommand(
            new CliCommand('build', 'Build one or more images of applications', [],
                async (command: CliCommand, args: IParsedArguments) => {
                    await this.handlers.miscHandlers.buildApplications(args);
                }));

        this.parser.addCommand(
            new CliCommand('build-push', 'Build and push one or more images of applications', [],
                async (command: CliCommand, args: IParsedArguments) => {
                    await this.handlers.miscHandlers.buildAndPushApplications(args);
                }));

        this.parser.addCommand(
            new CliCommand('run', 'Run a script from ck-config.js', [],
                async (command: CliCommand, args: IParsedArguments) => {
                    await this.handlers.miscHandlers.runScript(args);
                }));

        this.parser.addCommand(
            new CliCommand('svc deploy', 'Deploy one or more service applications',
                [envOption],
                async (command: CliCommand, args: IParsedArguments) => {
                    // TODO: restore completion:
                    // return this.api.getValidAppConfigurationsAsString(process.cwd(), AppType.SERVICE);
                    await this.handlers.appHandlers.deployApplications(AppType.SERVICE, args);
                }));

        this.parser.addCommand(
            new CliCommand('svc redeploy', 'Destroy then deploy one or more service applications',
                [envOption],
                async (command: CliCommand, args: IParsedArguments) => {
                    // TODO: restore completion:
                    // return this.api.getValidAppConfigurationsAsString(process.cwd(), AppType.SERVICE);
                    await this.handlers.appHandlers.redeployApplications(AppType.SERVICE, args);
                }));

        this.parser.addCommand(
            new CliCommand('svc destroy', 'Destroy one or more service applications',
                [envOption],
                async (command: CliCommand, args: IParsedArguments) => {
                    // TODO: restore completion:
                    // return this.api.getValidAppConfigurationsAsString(process.cwd(), AppType.SERVICE);
                    await this.handlers.appHandlers.destroyApplications(AppType.SERVICE, args);
                }));

        this.parser.addCommand(
            new CliCommand('deploy', 'Deploy one or more applications',
                [envOption],
                async (command: CliCommand, args: IParsedArguments) => {
                    // TODO: restore completion:
                    // return this.api.getValidAppConfigurationsAsString(process.cwd(), AppType.NORMAL);
                    await this.handlers.appHandlers.deployApplications(AppType.NORMAL, args);
                }));

        this.parser.addCommand(
            new CliCommand('redeploy', 'Destroy then deploy one or more applications',
                [envOption],
                async (command: CliCommand, args: IParsedArguments) => {
                    // TODO: restore completion:
                    // return this.api.getValidAppConfigurationsAsString(process.cwd(), AppType.NORMAL);
                    await this.handlers.appHandlers.redeployApplications(AppType.NORMAL, args);
                }));

        this.parser.addCommand(
            new CliCommand('destroy', 'Destroy one or more applications',
                [envOption],
                async (command: CliCommand, args: IParsedArguments) => {
                    // TODO: restore completion:
                    // return this.api.getValidAppConfigurationsAsString(process.cwd(), AppType.NORMAL);
                    await this.handlers.appHandlers.destroyApplications(AppType.NORMAL, args);
                }));

        this.parser.addCommand(
            new CliCommand('cluster deploy', 'Deploy a Kubernetes cluster',
                [envOption],
                async (command: CliCommand, args: IParsedArguments) => {
                    await this.handlers.appHandlers.deployApplications(AppType.CLUSTER, args);
                }));

        this.parser.addCommand(
            new CliCommand('cluster destroy', 'Destroy a Kubernetes cluster',
                [envOption],
                async (command: CliCommand, args: IParsedArguments) => {
                    await this.handlers.appHandlers.destroyApplications(AppType.CLUSTER, args);
                }));

    }

}
