import {AppType, IKubeApplication} from './appConfigTypes';

export const exampleCkConfig: IKubeApplication = {
    // these values will be deleted when persisted
    id: 0,
    type: AppType.APPLICATION,
    configPath: '/path/to/config',
    rootPath: '/path/to/app',
    // end

    name: 'config',
    applicationStructure: 'deployment',
    defaultEnvironment: 'dev',
    helm: {
        releaseName: 'gitlab-dev',
    },
    docker: {
        imageName: 'deployment-with-docker-file',
        tag: '0.1',
        push: true,
        buildDirectory: './path/to/docker/build',
    },
    scripts: {
        buildDev: './build --fancy application',
        runDev: './run --without-bug application',
        helmDebug: 'helm install --dry-run --debug .',
        kubectlDebug: 'kubectl create -f . --dry-run',
    },
};
