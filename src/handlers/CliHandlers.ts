import {IMainConfig} from '../main-config/configTypes';
import {Logger} from '../misc/Logger';

const logger = new Logger();

export class CliHandlers {
    private mainConfig: IMainConfig;

    constructor(mainConfig: IMainConfig) {
        this.mainConfig = mainConfig;
    }

}
