import * as path from 'path';
import {Logger} from '../misc/Logger';
import {IMainConfig} from '../main-config/configTypes';
import {IDockerOptions, IKubeApplication} from '../app-config/appConfigTypes';
import {CommandExecutor} from '../misc/CommandExecutor';

export class DockerBuilder {

    protected logger: Logger = new Logger();
    protected mainConfig: IMainConfig;
    private commandExec: CommandExecutor;

    constructor(mainConfig: IMainConfig, commandExec: CommandExecutor) {
        this.mainConfig = mainConfig;
        this.commandExec = commandExec;
    }

    public async build(appConfig: IKubeApplication) {
        if (!appConfig.docker) {
            throw new Error(`Application does not have a 'docker' configuration section`);
        }

        const buildDir = this.getBuildPathFromApp(appConfig);
        const imageName = this.getImageNameFromApp(appConfig.docker);
        const dockerBuildCommand = `docker build ${buildDir} -t ${imageName}`;

        await this.execCommand(dockerBuildCommand);
    }

    public async push(appConfig: IKubeApplication){
        if (!appConfig.docker) {
            throw new Error(`Application does not have a 'docker' configuration section`);
        }

        if (appConfig.docker.push) {
            await this.pushImageToRegistry(appConfig.docker);
        }

        if (appConfig.docker.pushBySSH) {
            await this.pushImageBySSH(appConfig);
        }

    }

    private async pushImageToRegistry(dockerOptions: IDockerOptions) {
        const imageName = this.getImageNameFromApp(dockerOptions);
        const dockerPushCommand = `docker push ${imageName}`;
        await this.execCommand(dockerPushCommand);
    }

    private pushImageBySSH(appConfig: IKubeApplication): any {
        // TODO: retrieve inventory from _cluster,
        // TODO: get playbook variables from config
        // TODO: launch ansible
        throw new Error('Method not implemented.');
    }

    private getImageNameFromApp(dockerOptions: IDockerOptions): string {
        return dockerOptions.imageName + ':' + dockerOptions.tag;
    }

    private getBuildPathFromApp(appConfig: IKubeApplication): string {
        if (!appConfig.docker) {
            throw new Error(`Application does not have a 'docker' configuration section`);
        }
        return path.join(appConfig.rootPath, appConfig.docker.buildDirectory);
    }

    protected execCommand(command: string): Promise<any> {
        return this.commandExec.execCommand(command, [], {displayOutput: true});
    }
}
