import {exampleAppConfig} from '../app-config/appConfigTypes';
import * as fs from 'fs';
import * as path from 'path';

export class DirectoryInitHelper {

    public static init() {

        const template = `
module.exports = %example-config
`;

        const formattedConfig = template.replace(
            '%example-config',
            JSON.stringify(exampleAppConfig, null, 2),
        );

        fs.writeFileSync(path.join(process.cwd(), 'ck-config.js'), formattedConfig);

    }
}
