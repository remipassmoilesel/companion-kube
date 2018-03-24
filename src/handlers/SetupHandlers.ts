import * as _ from 'lodash';

import {IMainConfig} from '../main-config/config-types';
import {Logger} from '../misc/Logger';
import {PrerequisiteChecker} from '../commands/PrerequisiteChecker';
import {AppConfigurationManager} from '../app-config/AppConfigurationManager';

const logger = new Logger();

export class SetupHandlers {
    private mainConfig: IMainConfig;
    private prereqChecker: PrerequisiteChecker;
    private appConfigMan: AppConfigurationManager;

    constructor(mainConfig: IMainConfig){
        this.mainConfig = mainConfig;
        this.prereqChecker = new PrerequisiteChecker(mainConfig);
        this.appConfigMan = new AppConfigurationManager(mainConfig);
    }

    public checkPrerequisites() {
        if (!this.prereqChecker.checkPrerequisites()){
            throw new Error('Missing prerequisites');
        }
    }

    public getApplicationConfigurations(targetDirectory: string) {
        this.appConfigMan.getConfigurationsFromPath(targetDirectory);
    }

}
