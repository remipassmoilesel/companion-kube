
import {IMainConfig} from './config-types';
import {PREREQUISITES} from '../commands/prerequisites';
import * as path from 'path';
import * as fs from 'fs';
import * as assert from 'assert';

const projectRoot = path.resolve(__dirname, '..', '..');
assert.ok(fs.existsSync(path.resolve(projectRoot, 'package.json')), 'Project root is invalid');

export const mainConfig: IMainConfig = {
    prerequisites: PREREQUISITES,
    projectRoot,
};
