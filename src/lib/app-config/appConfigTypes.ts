import * as Ajv from 'ajv';

export type ProjectType = 'deployment' | 'chart';

export interface IKubeApplication {

    // should not appear in configuration, will be injected later
    configPath: string;
    rootPath: string;
    systemComponent: boolean;
    // end

    name: string; // default value: configuration directory name
    projectType: ProjectType;
    docker?: IDockerOptions;
}

export interface IDockerOptions {
    containerName: string;
    tag: string;
    build: boolean;
    push: boolean;
}

export interface IInvalidApplication {
    config: IKubeApplication;
    errors: Ajv.ErrorObject[];
}

export interface IConfigValidationResult {
    valid: {
        apps: IKubeApplication[],
        service: IKubeApplication[],
    };
    invalid: IInvalidApplication[];
}

export const exampleAppConfig: IKubeApplication = {
    systemComponent: false,
    configPath: '/path/to/config',
    rootPath: '/path/to/',

    name: 'config',
    projectType: 'deployment',
    docker: {
        containerName: 'deployment-with-docker-file',
        tag: '0.1',
        build: false,
        push: false,
    },
};

