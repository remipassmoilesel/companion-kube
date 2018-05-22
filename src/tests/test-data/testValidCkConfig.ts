import {AppType, IKubeApplication} from '../../lib/app-config/appConfigTypes';

export const testValidCkConfig: IKubeApplication = {
    id: 0,
    configPath: '/test/config/path/',
    rootPath: '/test/root/path/',
    type: AppType.NORMAL,

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
    dockerImages: [
        {
            imageName: 'deployment-with-docker-file-1',
            tag: '0.1',
            push: true,
            buildDirectory: './path/to/docker/build-1',
        },
        {
            imageName: 'deployment-with-docker-file-2',
            tag: '0.1',
            push: true,
            buildDirectory: './path/to/docker/build-2',
        },
    ],
    deployment: {
        roots: [
            '.',
            './second/dir',
        ],
    },
    helm: {
        releaseName: 'gitlab-dev',
    },
    ansible: {
        inventoryDirectory: './path/to/dir/',
        playbooks: {
            deploy: '#/scripts/kubespray/cluster.yml',
            destroy: '#/scripts/kubespray/reset.yml',
        },
    },
    hooks: {
        preBuild: './pre-build.sh',
        preDeploy: './pre-deploy.sh',
        postDeploy: './post-deploy.sh',
        preDestroy: './pre-destroy.sh',
        postDestroy: './post-destroy.sh',

    },
};
