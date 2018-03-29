import {Logger} from '../misc/Logger';
import {IMainConfig} from '../main-config/configTypes';
import {exec, spawn} from 'child_process';
import {IKubeApplication} from './appConfigTypes';
import * as path from 'path';

export class DockerBuilder {

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
            const commandExec = spawn(command, [], {shell: true});

            commandExec.stdout.on('data', (data: any) => {
                process.stdout.write(data.toString());
            });

            commandExec.stderr.on('data', (data: any) => {
                process.stdout.write(data.toString());
            });

            commandExec.on('close', (code: number) => {
                if (code !== 0) {
                    reject(new Error(`Bad code: ${code}`));
                    return;
                }
                this.logger.info(`Script exited with code ${code}`);
                resolve(code);
            });

            commandExec.on('error', (err: Error) => {
                return reject(err);
            });
        });

    }
}
