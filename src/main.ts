#!/usr/bin/env node

import {error, info} from './misc/utils';
import {mainConfig} from './config';

import 'source-map-support/register';

// TODO: remove
info();
info(`Initialized with configuration: ${JSON.stringify(mainConfig, null, 2)}`);
info();

(async () => {

    try {

        // companion-kube ?

        // verifier la présence d'outils nécéssaires (helm, kubectl, ...)
        // Proposer installation ?
        // Proposer utilisation minikube ?
        // Rechercher les applications disponibles
        // Déployer ou stopper

    } catch (e) {
        error('Error while initializing Nginx configuration: ', e);
        process.exit(1);
    }

})();
