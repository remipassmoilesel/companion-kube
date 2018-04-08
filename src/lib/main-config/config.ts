
import * as path from 'path';
import * as fs from 'fs';
import * as assert from 'assert';
import {IMainConfig} from './configTypes';
import {PREREQUISITES} from '../prerequisites/prerequisites';

const projectRoot = path.resolve(__dirname, '..', '..', '..');
assert.ok(fs.existsSync(path.resolve(projectRoot, 'package.json')), 'Project root is invalid');

const packageJson = require(path.join(projectRoot, 'package.json'));

export const mainConfig: IMainConfig = {
    version: packageJson.version,
    prerequisites: PREREQUISITES,
    projectRoot,
    configSearchIgnore: [
        'node_modules/**/*',
        'build/**/*',
    ],
};
