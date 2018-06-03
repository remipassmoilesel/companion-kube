import {IMainConfig} from '../main-config/configTypes';
import {IKubeApplication} from '../app-config/appConfigTypes';
import {Logger} from '../log/Logger';
import {spawn} from 'child_process';
import {CommandExecutor} from '../utils/CommandExecutor';

export abstract class AbstractAppExecutor {

    private spawn = spawn;
    protected abstract logger: Logger;
    protected mainConfig: IMainConfig;
    private commandExecutor: CommandExecutor;

    constructor(mainConfig: IMainConfig, commandExecutor: CommandExecutor) {
        this.mainConfig = mainConfig;
        this.commandExecutor = commandExecutor;
    }

    public abstract isSupported(app: IKubeApplication): boolean;

    public abstract deploy(app: IKubeApplication, envName?: string): Promise<any>;

    public abstract destroy(app: IKubeApplication, envName?: string): Promise<any>;

    protected execCommand(command: string, displayOutput?: boolean): Promise<any> {
        this.logger.debug(`Executing command: ${command}`);
        return this.commandExecutor.execCommand(command, {displayOutput});
    }

}
