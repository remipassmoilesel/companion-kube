#!/usr/bin/env node

import {error, info} from './misc/utils';
import {mainConfig} from './config';

import 'source-map-support/register';

info();
info(`Initialized with configuration: ${JSON.stringify(mainConfig, null, 2)}`);
info();

(async () => {

    try {

    } catch (e) {
        error('Error while initializing Nginx configuration: ', e);
        process.exit(1);
    }

})();
