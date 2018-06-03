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

export const INVALID_APP_DIR = path.join(TEST_DATA_DIR, 'invalid');



export const VALID_APP_ROOT = path.join(TEST_DATA_DIR, 'applications');

export const VALID_DEPLOYMENT_APP_DIR = path.join(VALID_APP_ROOT, 'valid-deployment');
export const VALID_DEPLOYMENT_APP_PARENT = path.join(VALID_DEPLOYMENT_APP_DIR, '..');

export const VALID_CHART_APP_DIR = path.join(VALID_APP_ROOT, 'valid-chart');
export const VALID_CHART_APP_PARENT = path.join(VALID_CHART_APP_DIR, '..');



export const VALID_SVC_ROOT = path.join(TEST_DATA_DIR, '_service-components');

export const VALID_DEPLOYMENT_SVC_DIR = path.join(VALID_SVC_ROOT, 'valid-deployment');
export const VALID_DEPLOYMENT_SVC_PARENT = path.join(VALID_DEPLOYMENT_SVC_DIR, '..');

export const VALID_CHART_SVC_DIR = path.join(VALID_SVC_ROOT, 'valid-chart');
export const VALID_CHART_SVC_PARENT = path.join(VALID_CHART_SVC_DIR, '..');



assert.ok(fs.existsSync(TEST_DATA_DIR), `${TEST_DATA_DIR} does not exists`);
assert.ok(fs.existsSync(INVALID_APP_DIR), `${INVALID_APP_DIR} does not exists`);
