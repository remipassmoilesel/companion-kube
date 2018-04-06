import * as Ajv from 'ajv';

// ===================================
// MAIN
// ===================================

export type AppStructure = 'scripts' | 'deployment' | 'chart' | 'ansible';

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
    displayOutput?: boolean;
    defaultEnvironment?: string;

    docker?: IDockerOptions;
    deployment?: IDeploymentOptions;
    helm?: IHelmOptions;
    ansible?: IAnsibleOptions;
    scripts?: IScriptGroup;

    hooks?: IHooksOptions;
}

// ===================================
// DOCKER
// ===================================

export interface IDockerOptions {
    imageName: string;
    tag: string;
    push: boolean;
    buildDirectory: string;
}

// ===================================
// DEPLOYMENTS
// ===================================

export interface IDeploymentOptions {
    roots: string[];
}

// ===================================
// HELM CHARTS
// ===================================

export interface IHelmOptions {
    releaseName: string;
}

// ===================================
// ANSIBLE
// ===================================

export interface IAnsiblePlaybook {
    path: string;
}

export interface IAnsibleOptions {
    playbooks: { [s: string]: IAnsiblePlaybook };
}

// ===================================
// SCRIPTS
// ===================================

export interface IScriptGroup {
    [s: string]: string;
}

// ===================================
// HOOKS
// ===================================

export interface IHooksOptions {
    preDeploy?: string;
    postDeploy?: string;

    preDestroy?: string;
    postDestroy?: string;
}

