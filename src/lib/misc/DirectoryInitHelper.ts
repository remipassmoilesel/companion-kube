import {exampleAppConfig} from '../app-config/appConfigTypes';
import * as fs from 'fs';
import * as path from 'path';
import _ = require('lodash');

export class DirectoryInitHelper {

    public static init() {

        const configPath = path.join(process.cwd(), 'ck-config.js');

        const template = `
module.exports = %example-config
`;

        const lightConfig = _.clone(exampleAppConfig);
        delete lightConfig.rootPath;
        delete lightConfig.configPath;
        delete lightConfig.serviceComponent;

        const formattedConfig = template.replace(
            '%example-config',
            JSON.stringify(lightConfig, null, 2),
        );

        if (fs.existsSync(configPath)){
            throw new Error('File already exist !');
        }

        fs.writeFileSync(configPath, formattedConfig);
    }
}
