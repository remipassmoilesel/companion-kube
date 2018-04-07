import {ScriptRunner} from './ScriptRunner';
import {IKubeApplication} from '../app-config/appConfigTypes';

export class HookExecutor {

    public async executePostDestroyHook(app: IKubeApplication) {
        if (app.hooks && app.hooks.preDeploy) {
            await this.runScript(app, app.hooks.preDeploy);
        }
    }

    public async executePreDestroyHook(app: IKubeApplication) {
        if (app.hooks && app.hooks.preDestroy) {
            await this.runScript(app, app.hooks.preDestroy);
        }
    }

    public async executePostDeployHook(app: IKubeApplication) {
        if (app.hooks && app.hooks.postDeploy) {
            await this.runScript(app, app.hooks.postDeploy);
        }
    }

    public async executePreDeployHook(app: IKubeApplication) {
        if (app.hooks && app.hooks.preDeploy) {
            await this.runScript(app, app.hooks.preDeploy);
        }
    }

    private async runScript(app: IKubeApplication, script: string) {
        const scriptRunner = new ScriptRunner();
        await scriptRunner.run(script, []);
    }
}
