import * as path from 'path';
import * as _ from 'lodash';
import * as fs from 'fs';
import * as assert from 'assert';
import {IMainConfig} from './configTypes';
import {PREREQUISITES} from '../prerequisites/prerequisites';

const projectRoot = path.resolve(__dirname, '..', '..', '..');
assert.ok(fs.existsSync(path.resolve(projectRoot, 'package.json')), 'Project root is invalid');

const packageJson = require(path.join(projectRoot, 'package.json'));

const mainConfig: IMainConfig = {
    version: packageJson.version,
    debug: true,
    prerequisites: PREREQUISITES,
    projectRoot,
    configSearchIgnore: [
        'node_modules/**/*',
        'build/**/*',
        path.join(projectRoot, 'src/tests/test-data/**/*'),
        path.join(projectRoot, 'build/tests/test-data/**/*'),
    ],
};

export function getMainConfig(): IMainConfig {
    return _.cloneDeep(mainConfig);
}
