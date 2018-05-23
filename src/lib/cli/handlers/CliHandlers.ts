import {IMainConfig} from '../../main-config/configTypes';
import {Api} from '../../Api';
import {MiscHandlers} from './MiscHandlers';
import {AppHandlers} from './AppHandlers';
import {CommandExecutor} from '../../utils/CommandExecutor';

export class CliHandlers {
    public miscHandlers: MiscHandlers;
    public appHandlers: AppHandlers;

    constructor(mainConfig: IMainConfig, api: Api, commandExec: CommandExecutor) {
        this.appHandlers = new AppHandlers(mainConfig, api, commandExec);
        this.miscHandlers = new MiscHandlers(mainConfig, api, commandExec);
    }

}
