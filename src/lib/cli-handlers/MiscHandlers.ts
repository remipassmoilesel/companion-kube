import * as _ from 'lodash';
import {IApplicationArguments, IEnvironmentOptions, IInitOptions, IRunArguments} from '../cli/cliTypes';
import {AppType, IKubeApplication} from '../app-config/appConfigTypes';
import {ScriptRunner} from '../helpers/ScriptRunner';
import {CliOperations} from '../cli/CliOperations';
import {AbstractCliHandlersGroup} from './AbstractCliHandlersGroup';
import {IAugmentedError} from '../misc/IAppError';

export class MiscHandlers extends AbstractCliHandlersGroup {

    public initDirectory(args: any, options: IInitOptions) {
        this.display.showCliHeader();
        this.api.initDirectory(process.cwd(), options.f);
        this.logger.success('File ck-config.js created !');
    }

    public async runScript(args: IRunArguments, options: any) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        const appConfig: IKubeApplication = await this.api.loadAppConfiguration(process.cwd());

        if (!args.script || !args.script.length){
            this.display.showScripts(appConfig);
            throw new Error('You must specify a script to execute');
        }

        const scriptArgs: string[] = args.script;
        const scriptName = scriptArgs[0];

        const scriptRunner = new ScriptRunner();

        const script = _.find(appConfig.scripts, (scriptCom, scriptNam) => scriptNam === scriptName);
        if (!script) {
            throw new Error(` '${scriptName}' not found !`);
        }

        await scriptRunner.run(script, scriptArgs.slice(1));
    }

    public async listApplications(args: any, options: any) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        const appConfigs = await this.api.loadAppsConfigurationRecursively(process.cwd());
        this.display.showValidApps(appConfigs);
        this.display.showValidServiceComponents(appConfigs);

        if (appConfigs.invalid.length > 0) {
            const err: IAugmentedError = new Error('Invalid configurations found !');
            err.$invalidApps = appConfigs.invalid;
            throw err;
        }
        else if (appConfigs.valid.apps.length > 0 || appConfigs.valid.serviceApps.length > 0) {
            this.logger.success('All configurations are valid !');
        }
    }

    public async buildApplications(args: IApplicationArguments, options: IEnvironmentOptions) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        const {envName, apps} = await this.selectApps(AppType.ALL, args, options);
        await this.display.showWarningOnApps(CliOperations.BUILD, apps, envName);

        await this._buildApplications(apps);
    }

}
