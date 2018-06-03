import * as path from 'path';
import * as assert from 'assert';
import * as fs from 'fs';
import {Logger} from '../lib/log/Logger';
import {LogLevels} from '../lib/log/LogLevels';
import {execSync} from 'child_process';

const sourceMapSupport = require('source-map-support');
sourceMapSupport.install();

Logger.setLogLevel(LogLevels.error);

export const SRC_DIR = path.join(__dirname, '../../src/');
export const TEST_DATA_DIR = path.join(SRC_DIR, 'tests/test-data');
export const INVALID_CONF_DIR = path.join(TEST_DATA_DIR, 'invalid');

export const VALID_DEPLOYMENT_DIR = path.join(TEST_DATA_DIR, 'valid-deployment');
export const VALID_DEPLOYMENT_DIR_PARENT = path.join(VALID_DEPLOYMENT_DIR, '..');

export const VALID_CHART_DIR = path.join(TEST_DATA_DIR, 'valid-chart');
export const VALID_CHART_DIR_PARENT = path.join(VALID_CHART_DIR, '..');

assert.ok(fs.existsSync(TEST_DATA_DIR), `${TEST_DATA_DIR} does not exists`);
assert.ok(fs.existsSync(INVALID_CONF_DIR), `${INVALID_CONF_DIR} does not exists`);
