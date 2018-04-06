import * as _ from 'lodash';
import {IKubeApplication} from './appConfigTypes';

export class AppConfigHelpers {

    public static getLightAppConfig(app: IKubeApplication){
        const lightConfig = _.clone(app);
        delete lightConfig.id;
        delete lightConfig.rootPath;
        delete lightConfig.configPath;
        delete lightConfig.type;
        return lightConfig;
    }

}
