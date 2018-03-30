import {IEnvironmentArguments} from '../cli/cliTypes';
import {AbstractCliHandlersGroup} from './AbstractCliHandlersGroup';

export class ClusterHandlers extends AbstractCliHandlersGroup {

    public destroyCluster(args: IEnvironmentArguments) {
        throw new Error('Not implemented yet !');
    }

    public deployCluster(args: IEnvironmentArguments) {
        throw new Error('Not implemented yet !');
    }

}
