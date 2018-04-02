import * as _ from 'lodash';
import {IMainConfig} from '../main-config/configTypes';
import {AbstractAppExecutor} from './AbstractAppExecutor';
import {IKubeApplication} from '../app-config/appConfigTypes';
import {Logger} from '../misc/Logger';

export class AnsibleExecutor extends AbstractAppExecutor {
    public logger: Logger = new Logger();

    constructor(mainConfig: IMainConfig) {
        super(mainConfig);
    }

    public isSupported(app: IKubeApplication): boolean {
        return app.applicationStructure === 'ansible';
    }

    public async deploy(app: IKubeApplication, envName?: string): Promise<any> {
        if (!app.ansible) {
            throw new Error();
        }
        _.forEach(app.ansible.playbooks, (value, name) => {
            console.log(value, name);
        });
    }

    public async destroy(app: IKubeApplication, envName?: string): Promise<any> {
        if (!app.ansible) {
            throw new Error();
        }
        _.forEach(app.ansible.playbooks, (value, name) => {
            console.log(value, name);
        });
    }

}
