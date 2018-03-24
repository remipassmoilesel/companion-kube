import * as _ from 'lodash';
import {execSync} from 'child_process';
import {IMainConfig} from '../main-config/configTypes';
import {Logger} from '../misc/Logger';
import {IPrerequisite} from './prerequisites';

const logger = new Logger();

export class PrerequisiteChecker {
    private mainConfig: IMainConfig;
    private execSync: any;

    constructor(mainConfig: IMainConfig) {
        this.mainConfig = mainConfig;
        this.execSync = execSync;
    }

    public getMissingPrerequisites(): IPrerequisite[] {
        const missing: IPrerequisite[] = [];
        _.forEach(this.mainConfig.prerequisites, (prereq) => {
            try {
                this.execSync(`which ${prereq.command}`);
            } catch (e) {
                missing.push(prereq);
            }
        });
        return missing;
    }

}
