import {IMainConfig} from '../main-config/configTypes';
import {Api} from '../Api';
import {MiscHandlers} from './MiscHandlers';
import {AppHandlers} from './AppHandlers';
import {ClusterHandlers} from './ClusterHandlers';

export class CliHandlers {
    public miscHandlers: MiscHandlers;
    public appHandlers: AppHandlers;
    public clusterHandlers: ClusterHandlers;

    constructor(mainConfig: IMainConfig, api: Api) {
        this.appHandlers = new AppHandlers(mainConfig, api);
        this.clusterHandlers = new ClusterHandlers(mainConfig, api);
        this.miscHandlers = new MiscHandlers(mainConfig, api);
    }

}
