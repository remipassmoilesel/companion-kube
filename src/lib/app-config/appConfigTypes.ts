import * as Ajv from 'ajv';

export type ProjectType = 'deployment' | 'chart';

export interface IAppConfig {

    // should not appear in configuration, will be injected later
    configPath: string;
    // end

    name: string;
    projectType: ProjectType;
    docker?: IDockerConfig;
}

export interface IDockerConfig {
    build: boolean;
    containerName: string;
    tag: string;
}

export interface IInvalidConfig {
    config: IAppConfig;
    errors: Ajv.ErrorObject[];
}

export interface IConfigValidationResult {
    valid: IAppConfig[];
    invalid: IInvalidConfig[];
}

export const exampleAppConfig: IAppConfig = {
    name: 'config',
    configPath: '/path/to/config',
    projectType: 'deployment',
    docker: {
        build: false,
        containerName: 'deployment-with-docker-file',
        tag: '0.1',
    },
};

