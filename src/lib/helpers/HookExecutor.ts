import {IKubeApplication} from '../app-config/appConfigTypes';
import {CommandExecutor} from '../utils/CommandExecutor';
import {Logger} from '../log/Logger';

export class HookExecutor {
    private logger = new Logger();
    private commandExec: CommandExecutor;

    constructor(commandExec: CommandExecutor) {
        this.commandExec = commandExec;
    }

    public executePreBuildHook(app: IKubeApplication) {
        if (app.hooks && app.hooks.preBuild) {
            this.logger.info(`Executing pre-build hook: ${app.hooks.preBuild}`);
            return this.runScript(app, app.hooks.preBuild);
        }
    }

    public executePreDeployHook(app: IKubeApplication) {
        if (app.hooks && app.hooks.preDeploy) {
            this.logger.info(`Executing pre-deploy hook: ${app.hooks.preDeploy}`);
            return this.runScript(app, app.hooks.preDeploy);
        }
    }

    public executePostDeployHook(app: IKubeApplication) {
        if (app.hooks && app.hooks.postDeploy) {
            this.logger.info(`Executing post-deploy hook: ${app.hooks.postDeploy}`);
            return this.runScript(app, app.hooks.postDeploy);
        }
    }

    public executePreDestroyHook(app: IKubeApplication) {
        if (app.hooks && app.hooks.preDestroy) {
            this.logger.info(`Executing pre-destroy hook: ${app.hooks.preDestroy}`);
            return this.runScript(app, app.hooks.preDestroy);
        }
    }

    public executePostDestroyHook(app: IKubeApplication) {
        if (app.hooks && app.hooks.postDestroy) {
            this.logger.info(`Executing post-destroy hook: ${app.hooks.postDestroy}`);
            return this.runScript(app, app.hooks.postDestroy);
        }
    }

    private runScript(app: IKubeApplication, script: string) {
        return this.commandExec.execCommand(script,
            {displayOutput: app.displayCommandsOutput}, {cwd: app.rootPath});
    }
}
