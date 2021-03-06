import * as _ from 'lodash';
import {ICliApplicationsArguments, ICliForceEnvOptions, ICliRunArguments} from '../cliTypes';
import {AppType, IKubeApplication} from '../../app-config/appConfigTypes';
import {ScriptRunner} from '../../helpers/ScriptRunner';
import {CliOperations} from '../CliOperations';
import {AbstractCliHandlersGroup} from './AbstractCliHandlersGroup';
import {IAugmentedError} from '../../utils/IAppError';
import {CliCommand, IParsedArguments} from '../parser/CliCommand';

export class MiscHandlers extends AbstractCliHandlersGroup {

    public initDirectory(args: ICliForceEnvOptions) {
        this.display.showCliHeader();
        this.api.initDirectory(process.cwd(), args.f || false);
        this.logger.success('File ck-config.js created !');
    }

    public async runScript(args: ICliRunArguments) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        const appConfig: IKubeApplication = await this.api.loadAppConfiguration(process.cwd());

        if (!args.remainingArguments || !args.remainingArguments.length) {
            this.display.showScripts(appConfig);
            throw new Error('You must specify a script to execute');
        }

        const scriptArgs: string[] = args.remainingArguments;
        const scriptName = scriptArgs[0];

        const scriptRunner = new ScriptRunner(this.commandExec);
        const script = _.find(appConfig.scripts, (scriptCom, scriptNam) => scriptNam === scriptName);
        if (!script) {
            throw new Error(` '${scriptName}' not found !`);
        }

        const completeScriptCommand = `${script} ${scriptArgs.slice(1).join(' ')}`;
        await scriptRunner.run(completeScriptCommand);
    }

    public async listApplications() {
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

    public async buildApplications(args: ICliApplicationsArguments) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        const {envName, apps} = await this.selectApps(AppType.SERVICE_AND_APPLICATION, args);
        await this.display.showWarningOnApps(CliOperations.BUILD, apps, envName);

        await this._buildApplications(apps);
    }

    public async pushApplications(args: ICliApplicationsArguments) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        const {envName, apps} = await this.selectApps(AppType.SERVICE_AND_APPLICATION, args);
        await this.display.showWarningOnApps(CliOperations.PUSH, apps, envName);

        await this._pushApplications(apps);
    }

    public async buildAndPushApplications(args: ICliApplicationsArguments) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        const {envName, apps} = await this.selectApps(AppType.SERVICE_AND_APPLICATION, args);
        await this.display.showWarningOnApps(CliOperations.PUSH, apps, envName);

        await this._buildApplications(apps);
        await this._pushApplications(apps);
    }

    public showHelp(args: IParsedArguments, commands: CliCommand[]) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        if (!args.remainingArguments.length){
            this.display.showGlobalHelp(commands);
        } else {
            const searchedCommand = args.remainingArguments.join(' ');
            const foundCommand = _.find(commands, (comm) => comm.command === searchedCommand);
            if (!foundCommand){
                throw new Error(`Command not found: ${searchedCommand}`);
            }
            this.display.showCommandHelp(foundCommand);
        }
    }
}
