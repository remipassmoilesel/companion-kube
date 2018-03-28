import {Logger} from '../misc/Logger';
import {IMainConfig} from '../main-config/configTypes';
import {exec} from 'child_process';
import {IKubeApplication} from '../app-config/appConfigTypes';
import * as path from 'path';

export class DockerExecutor {

    private exec = exec;
    protected logger: Logger = new Logger();
    protected mainConfig: IMainConfig;

    constructor(mainConfig: IMainConfig) {
        this.mainConfig = mainConfig;
    }

    public async build(appConfig: IKubeApplication){
        if (!appConfig.docker){
            throw new Error(`Application does not have a 'docker' configuration section`);
        }

        const buildDir = path.join(appConfig.rootPath, appConfig.docker.buildDirectory);
        const imageName = appConfig.docker.imageName + ':' + appConfig.docker.tag;
        const dockerBuildCommand = `docker build ${buildDir} -t ${imageName}`;

        await this.execCommand(dockerBuildCommand);

        if (appConfig.docker.push){
            const dockerPushCommand = `docker push ${imageName}`;
            await this.execCommand(dockerPushCommand);
        }
    }

    protected execCommand(command: string, options?: any): Promise<any> {
        this.logger.debug(`Executing command: ${command}`);

        return new Promise((resolve, reject) => {
            this.exec(command, options, (error: any, stdout, stderr) => {
                if (error) {
                    this.logger.warning('Error !');
                    error.stdout = stdout;
                    error.stderr = stderr;
                    return reject(error);
                }
                return resolve({stdout, stderr});
            });
        });
    }
}
