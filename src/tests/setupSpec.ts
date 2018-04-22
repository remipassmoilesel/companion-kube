import * as path from 'path';
import * as assert from 'assert';
import * as fs from 'fs';

const sourceMapSupport = require('source-map-support');
sourceMapSupport.install();

export const TEST_DATA_DIR = path.join(__dirname, '../../src/tests/test-data');
export const INVALID_CONF_DIR = path.join(TEST_DATA_DIR, 'invalid');

assert.ok(fs.existsSync(TEST_DATA_DIR), `${TEST_DATA_DIR} does not exists`);
assert.ok(fs.existsSync(INVALID_CONF_DIR), `${INVALID_CONF_DIR} does not exists`);
