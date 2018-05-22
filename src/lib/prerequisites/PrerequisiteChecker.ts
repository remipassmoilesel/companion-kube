import * as _ from 'lodash';
import {execSync} from 'child_process';
import {IMainConfig} from '../main-config/configTypes';
import {Logger} from '../log/Logger';
import {IPrerequisite} from './prerequisites';
import {CommandExecutor} from '../utils/CommandExecutor';

const logger = new Logger();

export class PrerequisiteChecker {
    private mainConfig: IMainConfig;
    private commandExec: CommandExecutor;

    constructor(mainConfig: IMainConfig, commandExec: CommandExecutor) {
        this.mainConfig = mainConfig;
        this.commandExec = commandExec;
    }

    public getMissingPrerequisites(): IPrerequisite[] {
        const missing: IPrerequisite[] = [];
        _.forEach(this.mainConfig.prerequisites, (prereq) => {
            try {
                return this.commandExec.execCommand(`which ${prereq.command}`, [], {displayOutput: false});
            } catch (e) {
                missing.push(prereq);
            }
        });
        return missing;
    }

}
