import {Logger} from '../misc/Logger';
import {IMainConfig} from '../main-config/configTypes';
import {IKubeApplication} from '../app-config/appConfigTypes';
import * as path from 'path';
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

        const buildDir = path.join(appConfig.rootPath, appConfig.docker.buildDirectory);
        const imageName = appConfig.docker.imageName + ':' + appConfig.docker.tag;
        const dockerBuildCommand = `docker build ${buildDir} -t ${imageName}`;

        await this.execCommand(dockerBuildCommand);

        if (appConfig.docker.push) {
            const dockerPushCommand = `docker push ${imageName}`;
            await this.execCommand(dockerPushCommand);
        }
    }

    protected execCommand(command: string): Promise<any> {
        return this.commandExec.execCommand(command, [], {displayOutput: true});
    }
}
