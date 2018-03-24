import * as _ from 'lodash';
import {HelmExecutor} from './HelmExecutor';
import {DeploymentExecutor} from './DeploymentExecutor';
import {IMainConfig} from '../main-config/configTypes';
import {AbstractExecutor} from './AbstractExecutor';
import {IKubeApplication} from '../app-config/appConfigTypes';

export class ExecutorFinder {

    public static getAll(config: IMainConfig): AbstractExecutor[] {
        return [
            new HelmExecutor(config),
            new DeploymentExecutor(config),
        ];
    }

    public static getExecutorForApp(config: IMainConfig, app: IKubeApplication): AbstractExecutor {
        const all = ExecutorFinder.getAll(config);
        const ex = _.find(all, (exec) => exec.isSupported(app));
        if (!ex) {
            throw new Error(`Unhandled project: ${JSON.stringify(app)}`);
        }
        return ex;
    }
}