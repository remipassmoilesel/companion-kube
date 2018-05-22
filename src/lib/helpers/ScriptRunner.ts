import {Logger} from '../log/Logger';
import {CommandExecutor} from '../utils/CommandExecutor';

export class ScriptRunner {
    private logger = new Logger();
    private commandExec: CommandExecutor;

    constructor(commandExec: CommandExecutor) {
        this.commandExec = commandExec;
    }

    public run(script: string, scriptArgs: string[]): Promise<any> {
        this.logger.warning(`Running script: ${script}`);
        return this.commandExec.execCommand(script, scriptArgs, {displayOutput: true});
    }

}
