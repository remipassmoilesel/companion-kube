import * as _ from 'lodash';
import {AppType, IKubeApplication} from './appConfigTypes';

export class AppConfigHelpers {

    public static getLightAppConfig(app: IKubeApplication){
        const lightConfig = _.cloneDeep(app);
        delete lightConfig.id;
        delete lightConfig.rootPath;
        delete lightConfig.configPath;
        delete lightConfig.type;
        return lightConfig;
    }

    public static isType(app: IKubeApplication, type: AppType): boolean {
        if (type === AppType.SERVICE_AND_APPLICATION && app.type !== AppType.CLUSTER){
            return true;
        }

        return app.type === type;
    }
}
