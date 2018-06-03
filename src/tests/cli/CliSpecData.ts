import {VALID_APP_ROOT} from '../setupSpec';

export const expectedDockerBuildCommands = [
    [
        './pre-build.sh',
        {displayOutput: true},
        {cwd: VALID_APP_ROOT + '/valid-deployment'},
    ],
    [
        'docker build ' + VALID_APP_ROOT + '/valid-deployment/path/to/'
        + 'docker/build -t deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
];

export const expectedBuildPushCommands = [
    [
        './pre-build.sh',
        {displayOutput: true},
        {cwd: VALID_APP_ROOT + '/valid-deployment'},
    ],
    [
        'docker build ' + VALID_APP_ROOT + '/valid-deployment/path/to/'
        + 'docker/build -t deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
    [
        'docker push deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
];

export const expectedDeployCommandsForManifestWithoutEnvFlag = [
    [
        './pre-build.sh',
        {displayOutput: true},
        {cwd: VALID_APP_ROOT + '/valid-deployment'},
    ],
    [
        'docker build ' + VALID_APP_ROOT + '/valid-deployment/path/to'
        + '/docker/build -t deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
    [
        './pre-deploy.sh',
        {displayOutput: true},
        {cwd: VALID_APP_ROOT + '/valid-deployment'},
    ],
    [
        'kubectl create --namespace dev -f ' + VALID_APP_ROOT + '/valid-deployment',
        {displayOutput: true},
    ],
    [
        'kubectl create --namespace dev -f ' + VALID_APP_ROOT + '/valid-deployment/second/dir',
        {displayOutput: true},
    ],
    [
        './post-deploy.sh',
        {displayOutput: true},
        {cwd: VALID_APP_ROOT + '/valid-deployment'},
    ],
];

export const expectedDeployCommandsForManifestWithEnvFlag = [
    [
        './pre-build.sh',
        {displayOutput: true},
        {cwd: VALID_APP_ROOT + '/valid-deployment'},
    ],
    [
        'docker build ' + VALID_APP_ROOT + '/valid-deployment/path/to'
        + '/docker/build -t deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
    [
        './pre-deploy.sh',
        {displayOutput: true},
        {cwd: VALID_APP_ROOT + '/valid-deployment'},
    ],
    [
        'kubectl create --namespace prod -f ' + VALID_APP_ROOT + '/valid-deployment',
        {displayOutput: true},
    ],
    [
        'kubectl create --namespace prod -f ' + VALID_APP_ROOT + '/valid-deployment/second/dir',
        {displayOutput: true},
    ],
    [
        './post-deploy.sh',
        {displayOutput: true},
        {cwd: VALID_APP_ROOT + '/valid-deployment'},
    ],
];

export const expectedDeployCommandsForHelmChartWithoutEnvFlag = [
    [
        './pre-build.sh',
        {displayOutput: true},
        {cwd: VALID_APP_ROOT + '/valid-chart'},
    ],
    [
        'docker build ' + VALID_APP_ROOT + '/'
        + 'valid-chart/path/to/docker/build -t deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
    [
        './pre-deploy.sh',
        {displayOutput: true},
        {cwd: VALID_APP_ROOT + '/valid-chart'},
    ],
    [
        'kubectl create --namespace dev -f ' + VALID_APP_ROOT + '/valid-chart',
        {displayOutput: true},
    ],
    [
        'kubectl create --namespace dev -f ' + VALID_APP_ROOT + '/valid-chart/second/dir',
        {displayOutput: true},
    ],
    [
        './post-deploy.sh',
        {displayOutput: true},
        {cwd: VALID_APP_ROOT + '/valid-chart'},
    ],
];

export const expectedDeployCommandsForHelmChartWithEnvFlag = [
    [
        './pre-build.sh',
        {displayOutput: true},
        {cwd: VALID_APP_ROOT + '/valid-chart'},
    ],
    [
        'docker build ' + VALID_APP_ROOT + '/'
        + 'valid-chart/path/to/docker/build -t deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
    [
        './pre-deploy.sh',
        {displayOutput: true},
        {cwd: VALID_APP_ROOT + '/valid-chart'},
    ],
    [
        'kubectl create --namespace prod -f ' + VALID_APP_ROOT + '/valid-chart',
        {displayOutput: true},
    ],
    [
        'kubectl create --namespace prod -f ' + VALID_APP_ROOT + '/valid-chart/second/dir',
        {displayOutput: true},
    ],
    [
        './post-deploy.sh',
        {displayOutput: true},
        {cwd: VALID_APP_ROOT + '/valid-chart'},
    ],
];
