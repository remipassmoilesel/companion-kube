
import {IPrerequisite} from '../commands/prerequisites';

export interface IMainConfig {
    version: string;
    prerequisites: IPrerequisite[];
    projectRoot: string;
    configSearchIgnore: string[];
}
