import * as Ajv from 'ajv';

export type AppStructure = 'deployment' | 'chart';

export enum AppType {
    SERVICE = 'service',
    APPLICATION = 'application',
}

export interface IKubeApplication {

    // should not appear in configuration, will be injected later
    id: number;
    configPath: string;
    rootPath: string;
    type: AppType;
    // end

    name: string; // default value: configuration directory name
    applicationStructure: AppStructure;
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
        serviceApps: IKubeApplication[],
    };
    invalid: IInvalidApplication[];
}

export const exampleAppConfig: IKubeApplication = {
    id: 0,
    type: AppType.APPLICATION,
    configPath: '/path/to/config',
    rootPath: '/path/to/',

    name: 'config',
    applicationStructure: 'deployment',
    helm: {
        releaseName: 'gitlab-dev',
    },
    docker: {
        containerName: 'deployment-with-docker-file',
        tag: '0.1',
        push: true,
        build: true,
        buildDirectory: './path/to/docker/build',
    },
};


