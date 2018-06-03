export const expectedDockerBuildCommands = [
    [
        './pre-build.sh',
        {displayOutput: true},
        {cwd: '/home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid-deployment'},
    ],
    [
        'docker build /home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid-deployment/path/to/'
        + 'docker/build -t deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
];

export const expectedBuildPushCommands = [
    [
        './pre-build.sh',
        {displayOutput: true},
        {cwd: '/home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid-deployment'},
    ],
    [
        'docker build /home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid-deployment/path/to/'
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
        {cwd: '/home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid-deployment'},
    ],
    [
        'docker build /home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid-deployment/path/to'
        + '/docker/build -t deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
    [
        './pre-deploy.sh',
        {displayOutput: true},
        {cwd: '/home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid-deployment'},
    ],
    [
        'kubectl create --namespace dev -f /home/remipassmoilesel/projects/companion-kube/'
        + 'src/tests/test-data/valid-deployment',
        {displayOutput: true},
    ],
    [
        'kubectl create --namespace dev -f /home/remipassmoilesel/projects/companion-kube/src/tests/'
        + 'test-data/valid-deployment/second/dir',
        {displayOutput: true},
    ],
    [
        './post-deploy.sh',
        {displayOutput: true},
        {cwd: '/home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid-deployment'},
    ],
];

export const expectedDeployCommandsForManifestWithEnvFlag = [
    [
        './pre-build.sh',
        {displayOutput: true},
        {cwd: '/home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid-deployment'},
    ],
    [
        'docker build /home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid-deployment/path/to'
        + '/docker/build -t deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
    [
        './pre-deploy.sh',
        {displayOutput: true},
        {cwd: '/home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid-deployment'},
    ],
    [
        'kubectl create --namespace prod -f /home/remipassmoilesel/projects/companion-kube/src'
        + '/tests/test-data/valid-deployment',
        {displayOutput: true},
    ],
    [
        'kubectl create --namespace prod -f /home/remipassmoilesel/projects/companion-kube/src/tests/'
        + 'test-data/valid-deployment/second/dir',
        {displayOutput: true},
    ],
    [
        './post-deploy.sh',
        {displayOutput: true},
        {cwd: '/home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid-deployment'},
    ],
];

export const expectedDeployCommandsForHelmChartWithoutEnvFlag = [
    [
        './pre-build.sh',
        {displayOutput: true},
        {cwd: '/home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid-chart'},
    ],
    [
        'docker build /home/remipassmoilesel/projects/companion-kube/src/tests/test-data/'
        + 'valid-chart/path/to/docker/build -t deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
    [
        './pre-deploy.sh',
        {displayOutput: true},
        {cwd: '/home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid-chart'},
    ],
    ['kubectl create --namespace dev -f /home/remipassmoilesel/projects/companion-kube'
    + '/src/tests/test-data/valid-chart',
        {displayOutput: true},
    ],
    [
        'kubectl create --namespace dev -f /home/remipassmoilesel/projects/companion-kube/src'
        + '/tests/test-data/valid-chart/second/dir',
        {displayOutput: true},
    ],
    [
        './post-deploy.sh',
        {displayOutput: true},
        {cwd: '/home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid-chart'},
    ],
];

export const expectedDeployCommandsForHelmChartWithEnvFlag = [
    [
        './pre-build.sh',
        {displayOutput: true},
        {cwd: '/home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid-chart'},
    ],
    [
        'docker build /home/remipassmoilesel/projects/companion-kube/src/tests/test-data/'
        + 'valid-chart/path/to/docker/build -t deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
    [
        './pre-deploy.sh',
        {displayOutput: true},
        {cwd: '/home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid-chart'},
    ],
    ['kubectl create --namespace prod -f /home/remipassmoilesel/projects/companion-kube'
    + '/src/tests/test-data/valid-chart',
        {displayOutput: true},
    ],
    [
        'kubectl create --namespace prod -f /home/remipassmoilesel/projects/companion-kube/src'
        + '/tests/test-data/valid-chart/second/dir',
        {displayOutput: true},
    ],
    [
        './post-deploy.sh',
        {displayOutput: true},
        {cwd: '/home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid-chart'},
    ],
];
