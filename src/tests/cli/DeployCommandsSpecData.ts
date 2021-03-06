import {PROJECT_ROOT, VALID_APP_ROOT, VALID_SVC_ROOT} from '../setupSpec';

export const expectedAppDockerBuildCommands = [
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

export const expectedSvcDockerBuildCommands = [
    [
        './pre-build.sh',
        {displayOutput: true},
        {cwd: VALID_SVC_ROOT + '/valid-deployment'},
    ],
    [
        'docker build ' + VALID_SVC_ROOT + '/valid-deployment/path/to/docker/build -t deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
];


export const expectedAppBuildPushCommands = [
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

export const expectedAppDeployCommandsForManifestWithoutEnvFlag = [
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

export const expectedAppDeployCommandsForManifestWithEnvFlag = [
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

export const expectedSvcDeployCommandsForManifestWithEnvFlag = [
    [
        './pre-build.sh',
        {displayOutput: true},
        {cwd: VALID_SVC_ROOT + '/valid-deployment'},
    ],
    [
        'docker build ' + VALID_SVC_ROOT + '/valid-deployment/path/to/docker/build -t deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
    [
        './pre-deploy.sh',
        {displayOutput: true},
        {cwd: VALID_SVC_ROOT + '/valid-deployment'},
    ],
    [
        'kubectl create --namespace prod -f ' + VALID_SVC_ROOT + '/valid-deployment',
        {displayOutput: true},
    ],
    [
        'kubectl create --namespace prod -f ' + VALID_SVC_ROOT + '/valid-deployment/second/dir',
        {displayOutput: true},
    ],
    [
        './post-deploy.sh',
        {displayOutput: true},
        {cwd: VALID_SVC_ROOT + '/valid-deployment'},
    ],
];

export const expectedAppDeployCommandsForHelmChartWithoutEnvFlag = [
    [
        './pre-build.sh',
        {displayOutput: true},
        {cwd: VALID_APP_ROOT + '/valid-chart'}],
    [
        'docker build ' + VALID_APP_ROOT + '/valid-chart/path/to/docker/build -t deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
    [
        './pre-deploy.sh',
        {displayOutput: true},
        {cwd: VALID_APP_ROOT + '/valid-chart'}],
    [
        'helm dependency build ' + VALID_APP_ROOT + '/valid-chart',
        {displayOutput: true},
    ],
    [
        'helm install  --namespace dev  ' + VALID_APP_ROOT + '/valid-chart -n gitlab-dev',
        {displayOutput: true},
    ],
    [
        './post-deploy.sh',
        {displayOutput: true},
        {cwd: VALID_APP_ROOT + '/valid-chart'},
    ],
];

export const expectedAppDeployCommandsForHelmChartWithEnvFlag = [
    [
        './pre-build.sh',
        {displayOutput: true},
        {cwd: VALID_APP_ROOT + '/valid-chart'}],
    [
        'docker build ' + VALID_APP_ROOT + '/valid-chart/path/to/docker/build -t deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
    [
        './pre-deploy.sh',
        {displayOutput: true},
        {cwd: VALID_APP_ROOT + '/valid-chart'}],
    [
        'helm dependency build ' + VALID_APP_ROOT + '/valid-chart',
        {displayOutput: true},
    ],
    [
        'helm install  --namespace prod  ' + VALID_APP_ROOT + '/valid-chart -n gitlab-dev',
        {displayOutput: true},
    ],
    [
        './post-deploy.sh',
        {displayOutput: true},
        {cwd: VALID_APP_ROOT + '/valid-chart'},
    ],
];

export const expectedSvcDeployCommandsForHelmChartWithEnvFlag = [
    [
        './pre-build.sh',
        {displayOutput: true},
        {cwd: VALID_SVC_ROOT + '/valid-chart'},
    ],
    [
        'docker build ' + VALID_SVC_ROOT + '/valid-chart/path/to/docker/build -t deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
    [
        './pre-deploy.sh',
        {displayOutput: true},
        {cwd: VALID_SVC_ROOT + '/valid-chart'},
    ],
    [
        'helm dependency build ' + VALID_SVC_ROOT + '/valid-chart',
        {displayOutput: true},
    ],
    [
        'helm install  --namespace prod  ' + VALID_SVC_ROOT + '/valid-chart -n gitlab-dev',
        {displayOutput: true},
    ],
    [
        './post-deploy.sh',
        {displayOutput: true},
        {cwd: VALID_SVC_ROOT + '/valid-chart'},
    ],
];


export const expectedAppDeployCommandsForAnsibleWithoutEnvFlag = [
    [
        './pre-build.sh',
        {displayOutput: true},
        {cwd: VALID_APP_ROOT + '/valid-ansible'},
    ],
    [
        'docker build ' + VALID_APP_ROOT + '/valid-ansible/path/to/docker/build -t deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
    [
        './pre-deploy.sh',
        {displayOutput: true},
        {cwd: VALID_APP_ROOT + '/valid-ansible'},
    ],
    [
        'ansible-playbook -i ' + VALID_APP_ROOT + '/valid-ansible/path/to/dir/inventory-dev.cfg '
        + PROJECT_ROOT + '/scripts/kubespray/cluster.yml',
        {displayOutput: true},
    ],
    [
        './post-deploy.sh',
        {displayOutput: true},
        {cwd: VALID_APP_ROOT + '/valid-ansible'},
    ],
];

export const expectedAppDeployCommandsForAnsibleWithEnvFlag = [
    [
        './pre-build.sh',
        {displayOutput: true},
        {cwd: VALID_APP_ROOT + '/valid-ansible'},
    ],
    [
        'docker build ' + VALID_APP_ROOT + '/valid-ansible/path/to/docker/build -t deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
    [
        './pre-deploy.sh',
        {displayOutput: true},
        {cwd: VALID_APP_ROOT + '/valid-ansible'},
    ],
    [
        'ansible-playbook -i ' + VALID_APP_ROOT + '/valid-ansible/path/to/dir/inventory-prod.cfg '
        + PROJECT_ROOT + '/scripts/kubespray/cluster.yml',
        {displayOutput: true},
    ],
    ['./post-deploy.sh',
        {displayOutput: true},
        {cwd: VALID_APP_ROOT + '/valid-ansible'},
    ],
];

export const expectedSvcDeployCommandsForAnsibleWithEnvFlag = [
    [
        './pre-build.sh',
        {displayOutput: true},
        {cwd: VALID_SVC_ROOT + '/valid-ansible'},
    ],
    [
        'docker build ' + VALID_SVC_ROOT + '/valid-ansible/path/to/docker/build -t deployment-with-docker-file:0.1',
        {displayOutput: true},
    ],
    [
        './pre-deploy.sh',
        {displayOutput: true},
        {cwd: VALID_SVC_ROOT + '/valid-ansible'},
    ],
    [
        'ansible-playbook -i ' + VALID_SVC_ROOT + '/valid-ansible/path/to/dir/inventory-prod.cfg '
        + PROJECT_ROOT + '/scripts/kubespray/cluster.yml',
        {displayOutput: true},
    ],
    [
        './post-deploy.sh',
        {displayOutput: true},
        {cwd: VALID_SVC_ROOT + '/valid-ansible'},
    ],
];
