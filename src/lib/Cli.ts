import * as _ from 'lodash';
import {IMainConfig} from './main-config/configTypes';
import {Api} from './Api';
import {CliHandlers} from './cli/handlers/CliHandlers';
import {ICliApplicationsArguments, ICliBaseArguments, ICliRunArguments} from './cli/cliTypes';
import {CommandExecutor} from './utils/CommandExecutor';
import {AppType} from './app-config/appConfigTypes';

const yargs = require('yargs');

export type IErrorHandler = (e: Error) => any;

export class Cli {

    private mainConfig: IMainConfig;
    private handlers: CliHandlers;
    private api: Api;
    private onError: IErrorHandler;
    private parser: any;

    constructor(mainConfig: IMainConfig, api: Api, commandExec: CommandExecutor, onError: IErrorHandler) {
        this.mainConfig = mainConfig;
        this.api = api;
        this.handlers = new CliHandlers(mainConfig, api, commandExec);
        this.onError = onError;
    }

    public async setupAndParse(argv: string[]) {
        this.setupParser();
        this.parse(argv);
    }

    private setupParser() {

        this.parser = yargs
            .usage('Usage: $0 <cmd> [options]')
            .option('f', {
                alias: 'force',
                describe: 'Force initialization even if file already exists',
                default: false,
                type: 'boolean',
            })
            .option('e', {
                alias: 'environment',
                describe: 'Environment name to use',
                default: '',
                type: 'string',
            })
            // default command, used to display help and exit with non zero code if no command is specified
            // or if command is incorrect
            .command('*', false, _.noop, async (args: any) => {
                await this.catchErrors(async () => {
                    await this.handlers.miscHandlers.throwErrorForMissingCommand();
                });
            })
            .command('init', 'Create a full ck-config.js example', _.noop, async (args: ICliBaseArguments) => {
                await this.catchErrors(async () => {
                    await this.handlers.miscHandlers.initDirectory(args);
                });
            })
            .command('list', 'List available applications', _.noop, async (args: ICliBaseArguments) => {
                await this.catchErrors(async () => {
                    await this.handlers.miscHandlers.listApplications(args);
                });
            })
            .command('build <applications...>', 'Build one or more images of applications',
                _.noop, async (args: ICliApplicationsArguments) => {
                    await this.catchErrors(async () => {
                        await this.handlers.miscHandlers.buildApplications(args);
                    });
                })
            .command('build-push <applications...>', 'Build and push one or more images of applications',
                _.noop, async (args: ICliApplicationsArguments) => {
                    await this.catchErrors(async () => {
                        await this.handlers.miscHandlers.buildAndPushApplications(args);
                    });
                })
            .command('run <script...>', 'Run script from ck-config.js',
                _.noop, async (args: ICliRunArguments) => {
                    await this.catchErrors(async () => {
                        await this.handlers.miscHandlers.runScript(args);
                    });
                })
            .command('svc deploy <applications...>', 'Deploy one or more service applications',
                _.noop, async (args: ICliApplicationsArguments) => {
                    await this.catchErrors(async () => {
                        // TODO: restore completion:
                        // return this.api.getValidAppConfigurationsAsString(process.cwd(), AppType.SERVICE);
                        await this.handlers.appHandlers.deployApplications(AppType.SERVICE, args);
                    });
                })
            .command('svc redeploy <applications...>', 'Destroy then deploy one or more service applications',
                _.noop, async (args: ICliApplicationsArguments) => {
                    await this.catchErrors(async () => {
                        // TODO: restore completion:
                        // return this.api.getValidAppConfigurationsAsString(process.cwd(), AppType.SERVICE);
                        await this.handlers.appHandlers.redeployApplications(AppType.SERVICE, args);
                    });
                })
            .command('svc destroy <applications...>', 'Destroy one or more service applications',
                _.noop, async (args: ICliApplicationsArguments) => {
                    await this.catchErrors(async () => {
                        // TODO: restore completion:
                        // return this.api.getValidAppConfigurationsAsString(process.cwd(), AppType.SERVICE);
                        await this.handlers.appHandlers.destroyApplications(AppType.SERVICE, args);
                    });
                })
            .command('deploy <applications...>', 'Deploy one or more service applications',
                _.noop, async (args: ICliApplicationsArguments) => {
                    await this.catchErrors(async () => {
                        // TODO: restore completion:
                        // return this.api.getValidAppConfigurationsAsString(process.cwd(), AppType.NORMAL);
                        await this.handlers.appHandlers.deployApplications(AppType.NORMAL, args);
                    });
                })
            .command('redeploy <applications...>', 'Destroy then deploy one or more service applications',
                _.noop, async (args: ICliApplicationsArguments) => {
                    await this.catchErrors(async () => {
                        // TODO: restore completion:
                        // return this.api.getValidAppConfigurationsAsString(process.cwd(), AppType.NORMAL);
                        await this.handlers.appHandlers.redeployApplications(AppType.NORMAL, args);
                    });
                })
            .command('destroy <applications...>', 'Destroy one or more service applications',
                _.noop, async (args: ICliApplicationsArguments) => {
                    await this.catchErrors(async () => {
                        // TODO: restore completion:
                        // return this.api.getValidAppConfigurationsAsString(process.cwd(), AppType.NORMAL);
                        await this.handlers.appHandlers.destroyApplications(AppType.NORMAL, args);
                    });
                })
            .help('help')
            .version(this.mainConfig.version, 'version', 'display version information') // the version string.
            .alias('version', 'v')
            .example('ck init', 'TODO...')
            .example('ck list', 'TODO...')
            .example('ck build', 'TODO...')
            .epilog('For more information visit https://github.com/remipassmoilesel/companion-kube')
            .showHelpOnFail(false, 'Whoops, something went wrong ! run with help')
            .detectLocale(false);

    }

    private parse(argv: string[]): void {
        this.parser.parse(argv.slice(2));
    }

    private async catchErrors(cb: () => Promise<void>): Promise<void> {
        try {
            await cb();
        } catch (e) {
            this.onError(e);
        }
    }

}
