import * as Ajv from 'ajv';

export type ProjectType = 'deployment' | 'chart';

export interface IKubeApplication {

    // should not appear in configuration, will be injected later
    configPath: string;
    rootPath: string;
    // end

    name: string;
    projectType: ProjectType;
    docker?: IDockerOptions;
}

export interface IDockerOptions {
    build: boolean;
    containerName: string;
    tag: string;
}

export interface IInvalidApplication {
    config: IKubeApplication;
    errors: Ajv.ErrorObject[];
}

export interface IConfigValidationResult {
    valid: IKubeApplication[];
    invalid: IInvalidApplication[];
}

export const exampleAppConfig: IKubeApplication = {
    name: 'config',
    configPath: '/path/to/config',
    rootPath: '/path/to/',
    projectType: 'deployment',
    docker: {
        build: false,
        containerName: 'deployment-with-docker-file',
        tag: '0.1',
    },
};

