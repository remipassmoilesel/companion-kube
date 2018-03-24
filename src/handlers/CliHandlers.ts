import * as _ from 'lodash';

import {IMainConfig} from '../config/config-types';
import {Logger} from '../misc/Logger';
import {PrerequisiteChecker} from '../commands/PrerequisiteChecker';

const logger = new Logger();

export class CliHandlers {
    private mainConfig: IMainConfig;
    private prereqChecker: PrerequisiteChecker;

    constructor(mainConfig: IMainConfig){
        this.mainConfig = mainConfig;
        this.prereqChecker = new PrerequisiteChecker(mainConfig);
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
