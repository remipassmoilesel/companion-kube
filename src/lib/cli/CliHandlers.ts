import {IMainConfig} from '../main-config/configTypes';
import {Logger} from '../misc/Logger';
import {Api} from '../Api';
import {Help} from './Help';

const logger = new Logger();

export class CliHandlers {
    private mainConfig: IMainConfig;
    private api: Api;
    private cliProg: any;

    constructor(mainConfig: IMainConfig, api: Api) {
        this.mainConfig = mainConfig;
        this.api = api;
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
            .action(this.listApplications.bind(this));

        this.cliProg
            .command('deploy', 'Deploy one or more applications')
            .help(Help.deploy)
            .argument('<apps...>', 'Applications to deploy')
            .complete(() => {
                return this.api.getApplicationList();
            })
            .action(this.deployApplications.bind(this));
    }

    private listApplications(args: any, options: any, logger: any) {
        logger.info("Command 'list' called with:");
        logger.info('arguments: %j', args);
        logger.info('options: %j', options);
    }

    private deployApplications(args: any, options: any, logger: any) {
        logger.info("Command 'deploy' called with:");
        logger.info('arguments: %j', args);
        logger.info('options: %j', options);
    }

    private showHeader(){
        logger.info('Companion-Kube !');
        logger.info();
    }

    private parse(argv: string[]) {
        this.cliProg.parse(argv);
    }
}
