import * as _ from 'lodash';
import {execSync} from 'child_process';
import {IConfig} from '../config/config-types';
import {Logger} from '../misc/Logger';
import {PREREQUISITES} from './prerequisites';

const logger = new Logger();

export class PrerequisiteChecker {
    private appConfig: IConfig;

    constructor(appConfig: IConfig) {
        this.appConfig = appConfig;
    }

    public checkPrerequisites(): boolean {
        const missingPrerequisites = this.getMissingPrerequisites();
        if (missingPrerequisites.length > 0) {
            _.forEach(missingPrerequisites, (missing) => {
                logger.error(`Missing prerequisite: ${missing}`);
            });

            logger.error();
            logger.error(`You must install these tools before continue.`);
            logger.error();

            return false;
        }
        return true;
    }

    public getMissingPrerequisites(): string[] {
        const missing: string[] = [];
        _.forEach(PREREQUISITES, (prereq) => {
            try {
                execSync(`which ${prereq.command}`);
            } catch (e) {
                missing.push(prereq.command);
            }
        });
        return missing;
    }

}
