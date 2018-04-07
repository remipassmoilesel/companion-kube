import * as _ from 'lodash';
import * as path from 'path';
import * as Ajv from 'ajv';
import {IMainConfig} from '../main-config/configTypes';
import {GlobSync} from 'glob';
import {AppType, IKubeApplication} from './appConfigTypes';
import {AppConfigSchema} from './appConfigSchemas';
import {IAugmentedError} from '../misc/IAppError';
import {IInvalidApplication, IRecursiveLoadingResult} from './configTypes';

const json6schema = require('ajv/lib/refs/json-schema-draft-06.json');

// TODO: add cache per directory

export class AppConfigurationManager {
    public static SYSTEM_COMP_DIRECTORY = '_service-components';
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
            const config: IKubeApplication = require(configPath);
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
            valid: this.filterSystemComponents(valid),
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

        if (configPath.indexOf(AppConfigurationManager.SYSTEM_COMP_DIRECTORY) !== -1) {
            app.type = AppType.SERVICE;
        } else {
            app.type = AppType.APPLICATION;
        }
    }

    private filterSystemComponents(appConfigs: IKubeApplication[]) {
        const serviceApps = _.filter(appConfigs, (app: IKubeApplication) => app.type === AppType.SERVICE);
        const apps = _.filter(appConfigs, (app) => app.type === AppType.APPLICATION);
        return {
            serviceApps,
            apps,
        };
    }

}
