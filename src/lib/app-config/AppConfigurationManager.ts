import * as _ from 'lodash';
import * as path from 'path';
import * as Ajv from 'ajv';
import {IMainConfig} from '../main-config/configTypes';
import {GlobSync} from 'glob';
import {AppType, IKubeApplication} from './appConfigTypes';
import {AppConfigSchema} from './appConfigSchemas';
import {IAugmentedError} from '../misc/IAppError';
import {IInvalidApplication, IRecursiveLoadingResult, ISortedAppGroup} from './configTypes';

const json6schema = require('ajv/lib/refs/json-schema-draft-06.json');

// TODO: add cache per directory

export class AppConfigurationManager {
    public static CLUSTER_DIRECTORY = '_cluster';
    public static SERVICE_DIRECTORY = '_service-components';
    private static appCounter = 0;

    private mainConfig: IMainConfig;
    private ajv: Ajv.Ajv;

    constructor(mainConfig: IMainConfig) {
        this.mainConfig = mainConfig;
        this.ajv = new Ajv({allErrors: true});
        this.ajv.addMetaSchema(json6schema);
    }

    // FIXME: throw if project name is duplicate
    public async loadAppConfigurationsRecursively(targetDirectory: string): Promise<IRecursiveLoadingResult> {
        const configPaths = this.searchConfigurations(targetDirectory);
        return this.loadAndValidateConfigurations(configPaths);
    }

    public async loadApplicationConfiguration(targetConfPath: string): Promise<IKubeApplication> {
        const res = await this.loadAndValidateConfigurations([targetConfPath]);
        const app = res.valid.apps.concat(res.valid.serviceApps)[0];
        if (!app){
            const err: IAugmentedError = new Error('Invalid configuration !');
            err.$invalidApps = res.invalid;
            throw err;
        }
        return app;
    }

    public async validateConfig(config: any) {
        const appConfigValidator = this.ajv.compile(new AppConfigSchema().schema);
        const isValid: boolean = await appConfigValidator(config);
        const errors = appConfigValidator.errors;
        return { isValid, errors };
    }

    private async loadAndValidateConfigurations(configPaths: string[]): Promise<IRecursiveLoadingResult> {
        const valid: IKubeApplication[] = [];
        const invalid: IInvalidApplication[] = [];
        for (const configPath of configPaths){
            const config: IKubeApplication = JSON.parse(JSON.stringify(require(configPath)));
            const { isValid, errors } = await this.validateConfig(config);
            this.injectMetadataInConfig(config, configPath);

            if (isValid) {
                valid.push(config);
            } else {
                invalid.push({
                    app: config,
                    errors: errors as Ajv.ErrorObject[],
                });
            }
        }
        return {
            valid: this.sortApplications(valid),
            invalid,
        };
    }

    private searchConfigurations(targetDirectory: string): string[] {
        const glob = new GlobSync(`${targetDirectory}/**/ck-config.js`, {
            ignore: this.mainConfig.configSearchIgnore,
            realpath: true,
        });
        return glob.found;
    }

    private injectMetadataInConfig(app: IKubeApplication, configPath: string) {
        app.id = AppConfigurationManager.appCounter++;
        const configPathArr = configPath.split(path.sep);
        if (!app.name) {
            app.name = configPathArr[configPathArr.length - 2];
        }
        app.configPath = configPath;
        app.rootPath = configPathArr.slice(0, configPathArr.length - 1).join(path.sep);

        if (this.isServiceApp(app)) {
            app.type = AppType.SERVICE;
        } else if (this.isClusterApp(app)) {
            app.type = AppType.CLUSTER;
        } else {
            app.type = AppType.APPLICATION;
        }

        if (typeof app.displayCommandsOutput !== 'boolean'){
            app.displayCommandsOutput = true;
        }
    }

    private isServiceApp(app: IKubeApplication){
        return app.configPath.indexOf(AppConfigurationManager.SERVICE_DIRECTORY) !== -1;
    }

    private isClusterApp(app: IKubeApplication){
        return app.configPath.indexOf(AppConfigurationManager.CLUSTER_DIRECTORY) !== -1;
    }

    private sortApplications(appConfigs: IKubeApplication[]): ISortedAppGroup {
        const serviceApps = _.filter(appConfigs, (app: IKubeApplication) => app.type === AppType.SERVICE);
        const clusterApps = _.filter(appConfigs, (app: IKubeApplication) => app.type === AppType.CLUSTER);
        const apps = _.filter(appConfigs, (app) => app.type === AppType.APPLICATION);
        return {
            serviceApps,
            clusterApps,
            apps,
        };
    }

}
