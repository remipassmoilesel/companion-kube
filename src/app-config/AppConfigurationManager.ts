import * as _ from 'lodash';
import * as Ajv from 'ajv';
import {IMainConfig} from '../main-config/configTypes';
import {GlobSync} from 'glob';
import {IAppConfig} from './appConfigTypes';
import {AppConfigSchema} from './appConfigSchemas';

const json6schema = require('ajv/lib/refs/json-schema-draft-06.json');

export interface IInvalidConfig {
    config: IAppConfig;
    errors: Ajv.ErrorObject[];
}

export interface IConfigValidationResult {
    valid: IAppConfig[];
    invalid: IInvalidConfig[];
}

export class AppConfigurationManager {
    private mainConfig: IMainConfig;
    private ajv: Ajv.Ajv;
    private appConfigValidator: Ajv.ValidateFunction;

    constructor(mainConfig: IMainConfig) {
        this.mainConfig = mainConfig;
        this.ajv = new Ajv({allErrors: true});
        this.ajv.addMetaSchema(json6schema);
        this.appConfigValidator = this.ajv.compile(new AppConfigSchema().schema);
    }

    public loadAppConfigurations(targetDirectory: string): IConfigValidationResult {
        const configPaths = this.searchConfigurations(targetDirectory);
        return this.loadAndValidateConfigurations(configPaths);
    }

    private loadAndValidateConfigurations(configPaths: string[]): IConfigValidationResult {
        const valid: IAppConfig[] = [];
        const invalid: IInvalidConfig[] = [];
        _.forEach(configPaths, (configPath) => {
            const config: IAppConfig = require(configPath);
            const validRes: any = this.appConfigValidator(config);
            config.configPath = configPath;

            if (validRes) {
                valid.push(config);
            } else {
                invalid.push({
                    config,
                    errors: this.appConfigValidator.errors as Ajv.ErrorObject[],
                });
            }
        });
        return {
            valid,
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


}
