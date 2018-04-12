import {AppType, IKubeApplication} from './appConfigTypes';

export const exampleCkConfig: IKubeApplication = {
    // these values will be deleted when persisted
    id: 0,
    type: AppType.APPLICATION,
    configPath: '/path/to/config',
    rootPath: '/path/to/app',
    // end

    name: 'application-name',
    displayCommandsOutput: true,
    applicationStructure: 'deployment',
    defaultEnvironment: 'dev',
    scripts: {
        buildDev: './build --fancy application',
        runDev: './run --without-bug application',
        helmDebug: 'helm install --dry-run --debug .',
        kubectlDebug: 'kubectl create -f . --dry-run',
    },
    docker: {
        imageName: 'deployment-with-docker-file',
        tag: '0.1',
        push: true,
        buildDirectory: './path/to/docker/build',
    },
    deployment: {
        roots: ['.', './second/dir'],
    },
    helm: {
        releaseName: 'gitlab-dev',
    },
    ansible: {
        playbooks: {
            deploy: {
                path: '#/scripts/kubespray/cluster.yml',
            },
            destroy: {
                path: '#/scripts/kubespray/reset.yml',
            },
            scale: {
                path: '#/scripts/kubespray/scale.yml',
            },
        },
    },
    hooks: {
        preDeploy: './pre-deploy.sh',
        postDeploy: './post-deploy.sh',
        preDestroy: './pre-destroy.sh',
        postDestroy: './post-destroy.sh',
    },

};
