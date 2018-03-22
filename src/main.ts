import {HttpServer} from './templater/HttpServer';
import {NginxConfigurator} from './nginx/NginxConfigurator';
import {loadConfig, log} from './misc/utils';

const serverConfig = loadConfig();

log();
log(`Initialized with configuration: ${JSON.stringify(serverConfig, null, 2)}`);
log();

const configureNginx = async () => {

    try {
        const nginxConfigurator = new NginxConfigurator(serverConfig);
        await nginxConfigurator.configureAndReload();

        log('Nginx initialization succeed, starting template server ...');

        const httpServer = new HttpServer(serverConfig);
        await httpServer.start();
    } catch (e) {
        log('Error while initializing Nginx configuration: ', e);
    }

};

// let time for nginx to set up
setTimeout(configureNginx, serverConfig.nginxConfigurationInterval);
