import {IPrerequisite} from '../prerequisites/prerequisites';

export interface IMainConfig {
    version: string;
    debug: boolean;
    prerequisites: IPrerequisite[];
    projectRoot: string;
    configSearchIgnore: string[];
}
