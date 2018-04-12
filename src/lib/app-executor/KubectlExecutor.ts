import * as path from 'path';
import _ = require('lodash');
import {AbstractAppExecutor} from './AbstractAppExecutor';
import {IKubeApplication} from '../app-config/appConfigTypes';
import {Logger} from '../misc/Logger';

export class KubectlExecutor extends AbstractAppExecutor {
    protected logger: Logger = new Logger();

    public isSupported(app: IKubeApplication): boolean {
        return app.applicationStructure === 'deployment';
    }

    public async deploy(app: IKubeApplication, envName?: string): Promise<any> {
        const paths = this.getRootPaths(app);

        for (const absolutePath of paths){
            const namespaceOption = envName ? `--namespace ${envName}` : '';
            const command = `kubectl create ${namespaceOption} -f ${absolutePath}`;

            await this.execCommand(command, app.displayCommandsOutput);
        }
    }

    public async destroy(app: IKubeApplication, envName?: string): Promise<any> {
        const paths = this.getRootPaths(app);

        for (const absolutePath of paths){
            const namespaceOption = envName ? `--namespace ${envName}` : '';
            const command = `kubectl delete ${namespaceOption} -f ${absolutePath}`;

            await this.execCommand(command, app.displayCommandsOutput);
        }
    }

    private getRootPaths(app: IKubeApplication): string[] {
        if (!app.deployment || !app.deployment.roots){
            return [app.rootPath];
        }

        return _.map(app.deployment.roots, (relativePath: string) => {
            return path.join(app.rootPath, relativePath);
        });
    }
}
