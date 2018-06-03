export const expectedBuildCommands = [
    [
        './pre-build.sh',
        {displayOutput: true},
        {cwd: '/home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid'},
    ],
    [
        'docker build /home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid/path/to/'
        + 'docker/build -t deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
];

export const expectedBuildPushCommands = [
    [
        './pre-build.sh',
        {displayOutput: true},
        {cwd: '/home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid'},
    ],
    [
        'docker build /home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid/path/to/'
        + 'docker/build -t deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
    [
        'docker push deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
];

export const expectedDeployCommandsWithoutEnvFlag = [
    [
        './pre-build.sh',
        {displayOutput: true},
        {cwd: '/home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid'},
    ],
    [
        'docker build /home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid/path/to'
        + '/docker/build -t deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
    [
        './pre-deploy.sh',
        {displayOutput: true},
        {cwd: '/home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid'},
    ],
    [
        'kubectl create --namespace dev -f /home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid',
        {displayOutput: true},
    ],
    [
        'kubectl create --namespace dev -f /home/remipassmoilesel/projects/companion-kube/src/tests/'
        + 'test-data/valid/second/dir',
        {displayOutput: true},
    ],
    [
        './post-deploy.sh',
        {displayOutput: true},
        {cwd: '/home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid'},
    ],
];

export const expectedDeployCommandsWithEnvFlag = [
    [
        './pre-build.sh',
        {displayOutput: true},
        {cwd: '/home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid'},
    ],
    [
        'docker build /home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid/path/to'
        + '/docker/build -t deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
    [
        './pre-deploy.sh',
        {displayOutput: true},
        {cwd: '/home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid'},
    ],
    [
        'kubectl create --namespace prod -f /home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid',
        {displayOutput: true},
    ],
    [
        'kubectl create --namespace prod -f /home/remipassmoilesel/projects/companion-kube/src/tests/'
        + 'test-data/valid/second/dir',
        {displayOutput: true},
    ],
    [
        './post-deploy.sh',
        {displayOutput: true},
        {cwd: '/home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid'},
    ],
];
