import * as _ from 'lodash';
import {HelmExecutor} from './HelmExecutor';
import {KubectlExecutor} from './KubectlExecutor';
import {IMainConfig} from '../main-config/configTypes';
import {AbstractAppExecutor} from './AbstractAppExecutor';
import {IKubeApplication} from '../app-config/appConfigTypes';
import {AnsibleExecutor} from './AnsibleExecutor';
import {CommandExecutor} from '../misc/CommandExecutor';

export class ExecutorFinder {

    public static getAll(config: IMainConfig, commandExecutor: CommandExecutor): AbstractAppExecutor[] {
        return [
            new HelmExecutor(config, commandExecutor),
            new KubectlExecutor(config, commandExecutor),
            new AnsibleExecutor(config, commandExecutor),
        ];
    }

    public static getExecutorForApp(config: IMainConfig, commandExecutor: CommandExecutor,
                                    app: IKubeApplication): AbstractAppExecutor {
        const all = ExecutorFinder.getAll(config, commandExecutor);
        const ex = _.find(all, (exec) => exec.isSupported(app));
        if (!ex) {
            throw new Error(`Unhandled project: ${JSON.stringify(app)}`);
        }
        return ex;
    }
}
