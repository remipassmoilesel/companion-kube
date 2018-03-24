
import {IPrerequisite} from '../commands/prerequisites';

export interface IMainConfig {
    prerequisites: IPrerequisite[];
    projectRoot: string;
}
