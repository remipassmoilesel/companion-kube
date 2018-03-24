export type ProjectType = 'deployment' | 'chart';

export interface IAppConfig {
    configPath: string;
    projectType: ProjectType;
    docker?: IDockerConfig;
}

export interface IDockerConfig {
    build: boolean;
    containerName: string;
    tag: string;
}

export const exampleAppConfig: IAppConfig = {
    configPath: '/path/to/config', // should not appear in configuration, will be injected later
    projectType: 'deployment',
    docker: {
        build: false,
        containerName: 'deployment-with-docker-file',
        tag: '0.1',
    },
};
