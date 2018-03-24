import {IMainConfig} from '../main-config/configTypes';
import {Api} from '../Api';
import {CliHandlers} from './CliHandlers';
import {Help} from './Help';
import {Logger} from '../misc/Logger';

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
            .command('list', 'List available applications')
            .help(Help.list)
            .action(this.handlers.listApplications.bind(this.handlers));

        this.cliProg
            .command('deploy', 'Deploy one or more applications')
            .help(Help.deploy)
            .argument('<apps...>', 'Applications to deploy')
            .complete(() => {
                return this.api.loadAppsConfiguration(process.cwd());
            })
            .action(this.handlers.deployApplications.bind(this.handlers));
    }

    private parse(argv: string[]) {
        this.cliProg.parse(argv);
    }

}
