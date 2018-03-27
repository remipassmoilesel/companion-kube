import {exampleAppConfig} from './appConfigTypes';
import * as fs from 'fs';
import * as path from 'path';
import _ = require('lodash');
import {IMainConfig} from '../main-config/configTypes';

export class DirectoryInitHelper {

    private mainConfig: IMainConfig;

    constructor(mainConfig: IMainConfig){
        this.mainConfig = mainConfig;
    }

    public init(targetDir: string, force: boolean) {

        const configPath = path.join(targetDir, 'ck-config.js');

        const template = `
module.exports = %example-config
`;

        const lightConfig = _.clone(exampleAppConfig);
        delete lightConfig.id;
        delete lightConfig.rootPath;
        delete lightConfig.configPath;
        delete lightConfig.type;

        const formattedConfig = template.replace(
            '%example-config',
            JSON.stringify(lightConfig, null, 2),
        );

        if (fs.existsSync(configPath) && !force){
            throw new Error(`File 'ck-config.js' already exist !`);
        }

        fs.writeFileSync(configPath, formattedConfig);
    }
}
