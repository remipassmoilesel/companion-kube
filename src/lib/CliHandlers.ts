import {IMainConfig} from './main-config/configTypes';
import {Logger} from './misc/Logger';
import {Api} from './Api';
const prog = require('caporal');
const logger = new Logger();

export class CliHandlers {
    private mainConfig: IMainConfig;
    private api: Api;

    constructor(mainConfig: IMainConfig, api: Api) {
        this.mainConfig = mainConfig;
        this.api = api;
    }

    public setupAndParse(argv: string[]) {

    }
}
