import * as _ from 'lodash';
import {execSync} from 'child_process';
import {IMainConfig} from '../config/config-types';
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

    public checkPrerequisites(): boolean {
        const missingPrerequisites = this.getMissingPrerequisites();
        if (missingPrerequisites.length > 0) {
            _.forEach(missingPrerequisites, (missing) => {
                logger.error(`Missing prerequisite: ${missing.command}`);
                logger.info(`See: ${missing.installScript}`);
            });

            logger.error();
            logger.error(`You must install these tools before continue.`);
            logger.error();

            return false;
        }
        return true;
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
