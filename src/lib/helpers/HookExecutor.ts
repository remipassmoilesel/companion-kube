import {IKubeApplication} from '../app-config/appConfigTypes';
import {CommandExecutor} from '../misc/CommandExecutor';
import {Logger} from '../misc/Logger';

export class HookExecutor {
    private logger = new Logger();
    private commandExec: CommandExecutor;

    constructor(commandExec: CommandExecutor) {
        this.commandExec = commandExec;
    }

    public executePreDeployHook(app: IKubeApplication) {
        if (app.hooks && app.hooks.preDeploy) {
            this.logger.info(`Executing pre-deploy hook: ${app.hooks.preDeploy}`);
            return this.runScript(app, app.hooks.preDeploy);
        }
    }

    public executePostDeployHook(app: IKubeApplication) {
        if (app.hooks && app.hooks.postDeploy) {
            this.logger.info(`Executing post-deploy hook: ${app.hooks.preDeploy}`);
            return this.runScript(app, app.hooks.postDeploy);
        }
    }

    public executePreDestroyHook(app: IKubeApplication) {
        if (app.hooks && app.hooks.preDestroy) {
            this.logger.info(`Executing pre-destroy hook: ${app.hooks.preDeploy}`);
            return this.runScript(app, app.hooks.preDestroy);
        }
    }

    public executePostDestroyHook(app: IKubeApplication) {
        if (app.hooks && app.hooks.postDestroy) {
            this.logger.info(`Executing post-destroy hook: ${app.hooks.preDeploy}`);
            return this.runScript(app, app.hooks.postDestroy);
        }
    }

    private runScript(app: IKubeApplication, script: string) {
        return this.commandExec.execCommand(script, [], {displayOutput: app.displayCommandsOutput});
    }
}
