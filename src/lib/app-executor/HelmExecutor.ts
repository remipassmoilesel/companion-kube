import * as path from 'path';
import * as fs from 'fs';
import {IMainConfig} from '../main-config/configTypes';
import {AbstractAppExecutor} from './AbstractAppExecutor';
import {IKubeApplication} from '../app-config/appConfigTypes';
import {Logger} from '../misc/Logger';

export class HelmExecutor extends AbstractAppExecutor {
    public logger: Logger = new Logger();

    public isSupported(app: IKubeApplication): boolean {
        return app.applicationStructure === 'chart';
    }

    public async deploy(app: IKubeApplication, envName?: string): Promise<any> {
        await this.buildDependencies(app);
        await this.deployChart(app, envName);
    }

    public async destroy(app: IKubeApplication, envName?: string): Promise<any> {
        if (!app.helm) {
            throw new Error();
        }

        const command = `helm delete --purge ${app.helm.releaseName}`;
        await this.execCommand(command, app.displayOutput);
    }


    private async deployChart(app: IKubeApplication, envName: string | undefined) {

        if (!app.helm) {
            throw new Error();
        }

        const valuesFilesOptions = this.getValues(app, envName);
        const namespaceOption = envName ? ' --namespace ' + envName : '';

        const install = `helm install ${namespaceOption} ${valuesFilesOptions} `
            + `${app.rootPath} -n ${app.helm.releaseName}`;

        await this.execCommand(install, app.displayOutput);

    }

    private getValues(app: IKubeApplication, envName?: string): string {

        const values: string[] = [];
        const defaultValuesPath = path.join(app.rootPath, 'values.yaml');
        const envValuesPath = path.join(app.rootPath, `values-${envName}.yaml`);

        if (fs.existsSync(defaultValuesPath)) {
            values.push(`-f ${defaultValuesPath}`);
        } else {
            this.logger.warning('No values.yaml file found');
        }

        if (envName && fs.existsSync(envValuesPath)) {
            values.push(`-f ${envValuesPath}`);
        } else if (envName) {
            this.logger.warning(`No values-${envName}.yaml file found`);
        }

        return values.join(' ');
    }

    private async buildDependencies(app: IKubeApplication) {
        const dependencyBuild = `helm dependency build`;
        await this.execCommand(dependencyBuild, app.displayOutput,{cwd: app.rootPath});
    }

}
