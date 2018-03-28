import {IMainConfig} from '../main-config/configTypes';
import {AbstractAppExecutor} from './AbstractAppExecutor';
import {IKubeApplication} from '../app-config/appConfigTypes';
import {Logger} from '../misc/Logger';

export class HelmExecutor extends AbstractAppExecutor {
    public logger: Logger = new Logger();

    constructor(mainConfig: IMainConfig) {
        super(mainConfig);
    }

    public isSupported(app: IKubeApplication): boolean {
        return app.applicationStructure === 'chart';
    }

    public async deploy(app: IKubeApplication, envName?: string): Promise<any> {
        this.logger.info(`Deploying Chart ${app.name}`);

        if (!app.helm){
            throw new Error();
        }

        const dependencyBuild = `helm dependency build`;
        await this.execCommand(dependencyBuild, {cwd: app.rootPath});

        const install = `helm install ${app.rootPath} -n ${app.helm.releaseName}`;
        await this.execCommand(install);

        this.logger.success(`Finished !`);
    }

    public async destroy(app: IKubeApplication, envName?: string): Promise<any> {
        this.logger.info(`Destroying Chart ${app.name}`);

        if (!app.helm){
            throw new Error();
        }

        const command = `helm delete --purge ${app.helm.releaseName}`;
        await this.execCommand(command);

        this.logger.success(`Finished !`);
    }


}
