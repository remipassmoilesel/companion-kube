import * as _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';
import {AbstractAppExecutor} from './AbstractAppExecutor';
import {IAnsibleOptions, IAnsiblePlaybook, IKubeApplication} from '../app-config/appConfigTypes';
import {Logger} from '../misc/Logger';

export class AnsibleExecutor extends AbstractAppExecutor {
    private readonly INVENTORY_FILE_NAME = 'inventory-%env.cfg';
    public logger: Logger = new Logger();

    public isSupported(app: IKubeApplication): boolean {
        return app.applicationStructure === 'ansible';
    }

    public async deploy(app: IKubeApplication, envName?: string): Promise<any> {
        if (!app.ansible) {
            throw new Error();
        }

        const playbookPath = this.getPlaybookPath('deploy', app.ansible);
        await this.executePlaybook(playbookPath, app, envName);
    }

    public async destroy(app: IKubeApplication, envName?: string): Promise<any> {
        if (!app.ansible) {
            throw new Error();
        }
        const playbookPath = this.getPlaybookPath('destroy', app.ansible);
        await this.executePlaybook(playbookPath, app, envName);
    }

    private async executePlaybook(playbookPath: any, app: IKubeApplication, envName?: string) {
        const inventoryPath = this.getInventoryPath(app, envName);
        const command = `ansible-playbook -i ${inventoryPath} ${playbookPath}`;
        await this.execCommand(command);
    }

    private getPlaybookPath(playbookName: string, ansibleOptions: IAnsibleOptions) {
        const playbook = _.filter(ansibleOptions.playbooks, (value: IAnsiblePlaybook, name: string) => {
            return playbookName === name;
        })[0];
        if (!playbook) {
            throw new Error('A playbook with name ' + playbookName + ' must exists. Please define ' +
                'it in ck-config.js.');
        }
        return playbook.path;
    }

    private getInventoryPath(app: IKubeApplication, envName?: string): string {
        const inventoryName = this.INVENTORY_FILE_NAME.replace(
            '-%env',
            envName ? '-' + envName : '');

        const inventoryPath = path.join(app.rootPath, inventoryName);
        if (!fs.existsSync(inventoryPath)) {
            throw new Error('Inventory not found at location: ' + inventoryPath);
        }
        return inventoryPath;
    }
}

