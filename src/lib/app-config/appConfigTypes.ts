import * as Ajv from 'ajv';

export type AppStructure = 'deployment' | 'chart';

export enum AppType {
    SERVICE = 'service',
    APPLICATION = 'application',
    BOTH = 'both',
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
    defaultEnvironment?: string;
    docker?: IDockerOptions;
    helm?: IHelmOptions;
    scripts?: {[s: string]: string};
}

export interface IDockerOptions {
    imageName: string;
    tag: string;
    push: boolean;
    buildDirectory: string;
}

export interface IHelmOptions {
    releaseName: string;
}

export interface IInvalidApplication {
    config: IKubeApplication;
    errors: Ajv.ErrorObject[];
}

export interface IRecursiveLoadingResult {
    valid: {
        apps: IKubeApplication[],
        serviceApps: IKubeApplication[],
    };
    invalid: IInvalidApplication[];
}


