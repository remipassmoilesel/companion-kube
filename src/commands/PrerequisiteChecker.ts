import * as _ from 'lodash';
import {execSync} from 'child_process';
import {IConfig} from '../config/config-types';
import {Logger} from '../misc/Logger';
import {IPrerequisite} from './prerequisites';

const logger = new Logger();

export class PrerequisiteChecker {
    private appConfig: IConfig;
    private execSync: any;

    constructor(appConfig: IConfig) {
        this.appConfig = appConfig;
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
        _.forEach(this.appConfig.prerequisites, (prereq) => {
            try {
                this.execSync(`which ${prereq.command}`);
            } catch (e) {
                missing.push(prereq);
            }
        });
        return missing;
    }

}
