import {ICliApplicationsArguments} from '../cliTypes';
import {AppType} from '../../app-config/appConfigTypes';
import {CliOperations} from '../CliOperations';
import {AbstractCliHandlersGroup} from './AbstractCliHandlersGroup';

export class AppHandlers extends AbstractCliHandlersGroup {

    public async deployApplications(appType: AppType, args: ICliApplicationsArguments) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        const {apps, envName} = await this.selectApps(appType, args);
        await this.display.showWarningOnApps(CliOperations.DEPLOY, apps, envName);

        await this._buildApplications(apps);

        await this._deployApplications(apps, envName);
    }

    public async redeployApplications(appType: AppType, args: ICliApplicationsArguments) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        const {apps, envName} = await this.selectApps(appType, args);
        await this.display.showWarningOnApps(CliOperations.REDEPLOY, apps, envName);

        try {
            await this._destroyApplications(apps, envName);
        } catch (e) {
            this.logger.error('Cleaning did not go well ...');
            this.logger.error();
        }

        await this.wait(5);

        await this._buildApplications(apps);
        await this._deployApplications(apps, envName);
    }

    public async destroyApplications(appType: AppType, args: ICliApplicationsArguments) {
        this.display.showCliHeader();
        this.checkPrerequisites();

        const {apps, envName} = await this.selectApps(appType, args);
        await this.display.showWarningOnApps(CliOperations.DESTROY, apps, envName);

        await this._destroyApplications(apps, envName);
    }

}
