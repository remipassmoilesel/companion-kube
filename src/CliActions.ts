import * as _ from 'lodash';

import {IConfig} from './config/config-types';
import {Logger} from './misc/Logger';
import {PrerequisiteChecker} from './commands/PrerequisiteChecker';

const logger = new Logger();

export class CliActions {
    private appConfig: IConfig;
    private prereqChecker: PrerequisiteChecker;

    constructor(appConfig: IConfig){
        this.appConfig = appConfig;
        this.prereqChecker = new PrerequisiteChecker(appConfig);
    }

    public checkPrerequisites(){
        if (this.prereqChecker.checkPrerequisites()){
            return;
        }
        this.exit(1);
    }

    public exit(returnCode: number) {
        process.exit(returnCode);
    }

}
