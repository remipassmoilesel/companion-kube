import * as path from 'path';
import {Logger} from '../log/Logger';
import {IMainConfig} from '../main-config/configTypes';
import {IDockerImageOptions, IKubeApplication} from '../app-config/appConfigTypes';
import {CommandExecutor} from '../utils/CommandExecutor';

export class DockerBuilder {

    protected logger: Logger = new Logger();
    protected mainConfig: IMainConfig;
    private commandExec: CommandExecutor;

    constructor(mainConfig: IMainConfig, commandExec: CommandExecutor) {
        this.mainConfig = mainConfig;
        this.commandExec = commandExec;
    }

    public async build(appConfig: IKubeApplication) {
        if (!appConfig.dockerImages) {
            throw new Error(`Application does not have a 'docker' configuration section`);
        }

        for (const dockerImg of appConfig.dockerImages){
            const buildDir = this.getBuildPathFromApp(appConfig, dockerImg);
            const imageName = this.getImageNameFromApp(dockerImg);
            const dockerBuildCommand = `docker build ${buildDir} -t ${imageName}`;

            await this.execCommand(dockerBuildCommand);
        }
    }

    public async push(appConfig: IKubeApplication){

        if (!appConfig.dockerImages) {
            throw new Error(`Application does not have a 'docker' configuration section`);
        }

        for (const dockerImg of appConfig.dockerImages){
            if (dockerImg.push) {
                await this.pushImageToRegistry(dockerImg);
            }
        }
    }

    private async pushImageToRegistry(dockerOptions: IDockerImageOptions) {
        const imageName = this.getImageNameFromApp(dockerOptions);
        const dockerPushCommand = `docker push ${imageName}`;
        await this.execCommand(dockerPushCommand);
    }

    private getImageNameFromApp(dockerOptions: IDockerImageOptions): string {
        return dockerOptions.imageName + ':' + dockerOptions.tag;
    }

    private getBuildPathFromApp(appConfig: IKubeApplication, dockerImg: IDockerImageOptions): string {
        return path.join(appConfig.rootPath, dockerImg.buildDirectory);
    }

    protected execCommand(command: string): Promise<any> {
        return this.commandExec.execCommand(command, {displayOutput: true});
    }
}
