import * as _ from 'lodash';
import {HelmExecutor} from './HelmExecutor';
import {KubectlExecutor} from './KubectlExecutor';
import {IMainConfig} from '../main-config/configTypes';
import {AbstractAppExecutor} from './AbstractAppExecutor';
import {IKubeApplication} from '../app-config/appConfigTypes';

export class ExecutorFinder {

    public static getAll(config: IMainConfig): AbstractAppExecutor[] {
        return [
            new HelmExecutor(config),
            new KubectlExecutor(config),
        ];
    }

    public static getExecutorForApp(config: IMainConfig, app: IKubeApplication): AbstractAppExecutor {
        const all = ExecutorFinder.getAll(config);
        const ex = _.find(all, (exec) => exec.isSupported(app));
        if (!ex) {
            throw new Error(`Unhandled project: ${JSON.stringify(app)}`);
        }
        return ex;
    }
}
