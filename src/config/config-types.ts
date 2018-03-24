import * as path from 'path';
import * as fs from 'fs';
import * as assert from 'assert';
import {IPrerequisite} from '../commands/prerequisites';

export const projectRoot = path.resolve(__dirname, '..', '..');
assert.ok(fs.existsSync(path.resolve(projectRoot, 'package.json')), 'Project root is invalid');

export interface IConfig {
    prerequisites: IPrerequisite[];
}
