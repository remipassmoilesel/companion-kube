import * as _ from 'lodash';
import * as path from 'path';
import * as Ajv from 'ajv';
import {IMainConfig} from '../main-config/configTypes';
import {GlobSync} from 'glob';
import {AppType, IInvalidApplication, IKubeApplication, IRecursiveLoadingResult} from './appConfigTypes';
import {AppConfigSchema} from './appConfigSchemas';

const json6schema = require('ajv/lib/refs/json-schema-draft-06.json');

// TODO: add cache per directory

export class AppConfigurationManager {
    public static SYSTEM_COMP_DIRECTORY = '_service-components';
    private static appCounter = 0;

    private mainConfig: IMainConfig;
    private ajv: Ajv.Ajv;
    private appConfigValidator: Ajv.ValidateFunction;

    constructor(mainConfig: IMainConfig) {
        this.mainConfig = mainConfig;
        this.ajv = new Ajv({allErrors: true});
        this.ajv.addMetaSchema(json6schema);
        this.appConfigValidator = this.ajv.compile(new AppConfigSchema().schema);
    }

    // FIXME: throw if project name is duplicate
    public loadAppConfigurationsRecursively(targetDirectory: string): IRecursiveLoadingResult {
        const configPaths = this.searchConfigurations(targetDirectory);
        return this.loadAndValidateConfigurations(configPaths);
    }

    public loadApplicationConfiguration(targetConfPath: string): IKubeApplication {
        const res = this.loadAndValidateConfigurations([targetConfPath]);
        return res.valid.apps.concat(res.valid.serviceApps)[0];
    }

    private loadAndValidateConfigurations(configPaths: string[]): IRecursiveLoadingResult {
        const valid: IKubeApplication[] = [];
        const invalid: IInvalidApplication[] = [];
        _.forEach(configPaths, (configPath) => {
            const config: IKubeApplication = require(configPath);
            const validationResult: any = this.appConfigValidator(config);
            this.injectMetadataInConfig(config, configPath);

            if (validationResult) {
                valid.push(config);
            } else {
                invalid.push({
                    config,
                    errors: this.appConfigValidator.errors as Ajv.ErrorObject[],
                });
            }
        });
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
