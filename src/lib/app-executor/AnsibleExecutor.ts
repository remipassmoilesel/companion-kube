import * as _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';
import {AbstractAppExecutor} from './AbstractAppExecutor';
import {IAnsibleOptions, IKubeApplication, DEFAULT_PLAYBOOKS} from '../app-config/appConfigTypes';
import {Logger} from '../log/Logger';

export class AnsibleExecutor extends AbstractAppExecutor {

    /**
     * When used in a playbook path, allow to make path relative to this project root
     * @type {string}
     */
    private readonly CK_RELATIVE_PATH_PREFIX: string = '#/';
    private readonly INVENTORY_FILE_TEMPLATE = 'inventory-%env.cfg';
    protected logger: Logger = new Logger();

    public isSupported(app: IKubeApplication): boolean {
        return app.applicationStructure === 'ansible';
    }

    public async deploy(app: IKubeApplication, envName?: string): Promise<any> {
        if (!app.ansible) {
            throw new Error('Ansible section is mandatory !');
        }

        const playbookPath = this.getPlaybookPath('deploy', app.ansible);
        await this.executePlaybook(playbookPath, app, envName);
    }

    public async destroy(app: IKubeApplication, envName?: string): Promise<any> {
        if (!app.ansible) {
            throw new Error('Ansible section is mandatory !');
        }

        const playbookPath = this.getPlaybookPath('destroy', app.ansible);
        await this.executePlaybook(playbookPath, app, envName);
    }

    private async executePlaybook(playbookPath: any, app: IKubeApplication, envName?: string) {
        const inventoryPath = this.getInventoryPath(app, envName);
        const command = `ansible-playbook -i ${inventoryPath} ${playbookPath}`;
        await this.execCommand(command, true);
    }

    private getPlaybookPath(playbookName: DEFAULT_PLAYBOOKS, ansibleOptions: IAnsibleOptions): string {
        const playbook = ansibleOptions.playbooks[playbookName];
        if (!playbook) {
            throw new Error(`A playbook with name ${playbookName} must exists. Please define it in ck-config.js.`);
        }
        if (playbook.startsWith(this.CK_RELATIVE_PATH_PREFIX)) {
            const withoutPrefix = playbook.substring(this.CK_RELATIVE_PATH_PREFIX.length);
            return path.join(this.mainConfig.projectRoot, withoutPrefix);
        }
        return path.resolve(playbook);
    }

    private getInventoryPath(app: IKubeApplication, envName?: string): string {
        if (!app.ansible){
            throw new Error();
        }

        const inventoryName = this.INVENTORY_FILE_TEMPLATE.replace(
            '-%env',
            envName ? '-' + envName : '');

        const inventoryDirectory = path.join(app.rootPath, app.ansible.inventoryDirectory || '');
        const inventoryPath = path.join(inventoryDirectory, inventoryName);
        if (!fs.existsSync(inventoryPath)) {
            throw new Error(`Inventory not found at location: ${inventoryPath}`);
        }
        return inventoryPath;
    }

}


