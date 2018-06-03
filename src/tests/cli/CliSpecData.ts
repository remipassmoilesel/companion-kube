import {TEST_DATA_DIR} from '../setupSpec';

export const expectedDockerBuildCommands = [
    [
        './pre-build.sh',
        {displayOutput: true},
        {cwd: TEST_DATA_DIR + '/valid-deployment'},
    ],
    [
        'docker build ' + TEST_DATA_DIR + '/valid-deployment/path/to/'
        + 'docker/build -t deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
];

export const expectedBuildPushCommands = [
    [
        './pre-build.sh',
        {displayOutput: true},
        {cwd: TEST_DATA_DIR + '/valid-deployment'},
    ],
    [
        'docker build ' + TEST_DATA_DIR + '/valid-deployment/path/to/'
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
        {cwd: TEST_DATA_DIR + '/valid-deployment'},
    ],
    [
        'docker build ' + TEST_DATA_DIR + '/valid-deployment/path/to'
        + '/docker/build -t deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
    [
        './pre-deploy.sh',
        {displayOutput: true},
        {cwd: TEST_DATA_DIR + '/valid-deployment'},
    ],
    [
        'kubectl create --namespace dev -f ' + TEST_DATA_DIR + '/valid-deployment',
        {displayOutput: true},
    ],
    [
        'kubectl create --namespace dev -f ' + TEST_DATA_DIR + '/valid-deployment/second/dir',
        {displayOutput: true},
    ],
    [
        './post-deploy.sh',
        {displayOutput: true},
        {cwd: TEST_DATA_DIR + '/valid-deployment'},
    ],
];

export const expectedDeployCommandsForManifestWithEnvFlag = [
    [
        './pre-build.sh',
        {displayOutput: true},
        {cwd: TEST_DATA_DIR + '/valid-deployment'},
    ],
    [
        'docker build ' + TEST_DATA_DIR + '/valid-deployment/path/to'
        + '/docker/build -t deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
    [
        './pre-deploy.sh',
        {displayOutput: true},
        {cwd: TEST_DATA_DIR + '/valid-deployment'},
    ],
    [
        'kubectl create --namespace prod -f ' + TEST_DATA_DIR + '/valid-deployment',
        {displayOutput: true},
    ],
    [
        'kubectl create --namespace prod -f ' + TEST_DATA_DIR + '/valid-deployment/second/dir',
        {displayOutput: true},
    ],
    [
        './post-deploy.sh',
        {displayOutput: true},
        {cwd: TEST_DATA_DIR + '/valid-deployment'},
    ],
];

export const expectedDeployCommandsForHelmChartWithoutEnvFlag = [
    [
        './pre-build.sh',
        {displayOutput: true},
        {cwd: TEST_DATA_DIR + '/valid-chart'},
    ],
    [
        'docker build ' + TEST_DATA_DIR + '/'
        + 'valid-chart/path/to/docker/build -t deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
    [
        './pre-deploy.sh',
        {displayOutput: true},
        {cwd: TEST_DATA_DIR + '/valid-chart'},
    ],
    [
        'kubectl create --namespace dev -f ' + TEST_DATA_DIR + '/valid-chart',
        {displayOutput: true},
    ],
    [
        'kubectl create --namespace dev -f ' + TEST_DATA_DIR + '/valid-chart/second/dir',
        {displayOutput: true},
    ],
    [
        './post-deploy.sh',
        {displayOutput: true},
        {cwd: TEST_DATA_DIR + '/valid-chart'},
    ],
];

export const expectedDeployCommandsForHelmChartWithEnvFlag = [
    [
        './pre-build.sh',
        {displayOutput: true},
        {cwd: TEST_DATA_DIR + '/valid-chart'},
    ],
    [
        'docker build ' + TEST_DATA_DIR + '/'
        + 'valid-chart/path/to/docker/build -t deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
    [
        './pre-deploy.sh',
        {displayOutput: true},
        {cwd: TEST_DATA_DIR + '/valid-chart'},
    ],
    [
        'kubectl create --namespace prod -f ' + TEST_DATA_DIR + '/valid-chart',
        {displayOutput: true},
    ],
    [
        'kubectl create --namespace prod -f ' + TEST_DATA_DIR + '/valid-chart/second/dir',
        {displayOutput: true},
    ],
    [
        './post-deploy.sh',
        {displayOutput: true},
        {cwd: TEST_DATA_DIR + '/valid-chart'},
    ],
];
