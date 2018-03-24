import {IConfig} from './misc/config-types';

export class CliActions {
    private appConfig: IConfig;

    constructor(appConfig: IConfig){
        this.appConfig = appConfig;
    }

}
