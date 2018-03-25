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
    helm?: IHelmOptions;
}

export interface IDockerOptions {
    containerName: string;
    tag: string;
    push: boolean;
    build: boolean;
    buildDirectory: string;
}

export interface IHelmOptions {
    releaseName: string;
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
        push: true,
        build: true,
        buildDirectory: './path/to/docker/build',
    },
};

