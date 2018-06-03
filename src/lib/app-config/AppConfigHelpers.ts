import * as _ from 'lodash';
import {AppType, IKubeApplication} from './appConfigTypes';
import {IAppError, IAugmentedError} from '../utils/IAppError';

export class AppConfigHelpers {

    public static getLightAppConfig(app: IKubeApplication) {
        const lightConfig = _.cloneDeep(app);
        delete lightConfig.id;
        delete lightConfig.rootPath;
        delete lightConfig.configPath;
        delete lightConfig.type;
        return lightConfig;
    }

    public static isType(app: IKubeApplication, type: AppType): boolean {
        if (type === AppType.SERVICE_AND_APPLICATION && app.type !== AppType.CLUSTER) {
            return true;
        }

        return app.type === type;
    }

    public static async walkApplications(apps: IKubeApplication[], cb: (app: IKubeApplication) => Promise<any>) {
        const errors: IAppError[] = [];
        for (const app of apps) {
            try {
                await cb(app);
            } catch (error) {
                errors.push({
                    app,
                    error,
                });
            }
        }

        if (errors.length > 0) {
            const err: IAugmentedError = new Error('The following errors occurred: ');
            err.$appErrors = errors;
            throw err;
        }
    }

}
