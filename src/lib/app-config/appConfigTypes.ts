// .....

// ===================================
// MAIN
// ===================================

export type AppStructure = 'scripts' | 'deployment' | 'chart' | 'ansible';

export enum AppType {
    SERVICE = 'service',
    NORMAL = 'application',
    CLUSTER = 'cluster',
    ALL = 'all',
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
    displayCommandsOutput?: boolean;
    defaultEnvironment?: string;

    scripts?: IScriptGroup;
    dockerImages?: IDockerImageOptions[];
    deployment?: IDeploymentOptions;
    helm?: IHelmOptions;
    ansible?: IAnsibleOptions;

    hooks?: IHooksOptions;
}

// ===================================
// DOCKER
// ===================================

export interface IDockerImageOptions {
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

export type DEFAULT_PLAYBOOKS = 'deploy' | 'destroy';

export interface IAnsibleOptions {
    inventoryDirectory: string;
    playbooks: {
        deploy: string,
        destroy: string,
    };
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
    preBuild?: string;

    preDeploy?: string;
    postDeploy?: string;

    preDestroy?: string;
    postDestroy?: string;
}

