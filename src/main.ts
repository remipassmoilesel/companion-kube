#!/usr/bin/env node

import {Logger, LogLevels} from './misc/Logger';
import {CliActions} from './CliActions';
import {mainConfig} from './config';

import 'source-map-support/register';

const logger = new Logger({namespace: 'main', logLevel: LogLevels.info});
const cliActions = new CliActions(mainConfig);

logger.info('Companion-Kube !');

(async () => {

    try {

        // companion-kube ?

        // verifier la présence d'outils nécéssaires (helm, kubectl, ...)
        // Proposer installation ?
        // Proposer utilisation minikube ?
        // Rechercher les applications disponibles
        // Déployer ou stopper

    } catch (e) {
        logger.error('Error: ', e);
        process.exit(1);
    }

})();
