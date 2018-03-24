
import {IPrerequisite} from '../prerequisites/prerequisites';

export interface IMainConfig {
    version: string;
    prerequisites: IPrerequisite[];
    projectRoot: string;
    configSearchIgnore: string[];
}
