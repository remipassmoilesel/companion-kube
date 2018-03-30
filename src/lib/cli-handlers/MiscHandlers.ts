import * as _ from 'lodash';
import {IApplicationArguments, IEnvironmentOptions, IInitOptions, IRunArguments,} from '../cli/cliTypes';
import {AppType, IKubeApplication} from '../app-config/appConfigTypes';
import {ScriptRunner} from '../app-config/ScriptRunner';
import {CliOperations} from '../cli/CliOperations';
import {AbstractCliHandlersGroup} from './AbstractCliHandlersGroup';

export class MiscHandlers extends AbstractCliHandlersGroup {

    public initDirectory(args: any, options: IInitOptions) {
        this.display.showCliHeader();
        this.api.initDirectory(process.cwd(), options.f);
        this.logger.success('File ck-config.js created !');
    }

    public async runScript(args: IRunArguments, options: any) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        const scriptName = args.script;

        const scriptRunner = new ScriptRunner();
        const appConfig: IKubeApplication = this.api.loadAppConfiguration(process.cwd());

        const script = _.find(appConfig.scripts, (scriptCom, scriptNam) => scriptNam === scriptName);
        if (!script) {
            throw new Error(` '${scriptName}' not found !`);
        }

        await scriptRunner.run(script);
    }

    public listApplications(args: any, options: any) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        const appConfigs = this.api.loadAppsConfigurationRecursively(process.cwd());
        this.display.showValidApps(appConfigs);
        this.display.showValidServiceComponents(appConfigs);

        if (appConfigs.invalid.length > 0) {
            this.display.showInvalidConfigurations(appConfigs);
            throw new Error('Invalid configuration');
        }
        else if (appConfigs.valid.apps.length > 0 || appConfigs.valid.serviceApps.length > 0) {
            this.logger.success('All configurations are valid !');
        }
    }

    public async buildApplications(args: IApplicationArguments, options: IEnvironmentOptions) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        const {envName, apps} = await this.selectApps(AppType.BOTH, args, options);
        await this.display.showWarningOnApps(CliOperations.BUILD, apps, envName);

        await this._buildApplications(apps);
    }

}
