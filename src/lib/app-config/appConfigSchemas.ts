export class AppConfigSchema {

    // See https://jsonschema.net
    // Root ID: https://github.com/remipassmoilesel/companion-kube/kc-config.json
    // Object Assertions > ADD'L Properties false
    // Object Assertions > REQD Properties true
    // Optional properties:
    // /properties/name
    // /properties/docker
    // /properties/helm

    public schema = {
        $id: 'https://github.com/remipassmoilesel/companion-kube/kc-config.json',
        type: 'object',
        definitions: {},
        $schema: 'http://json-schema.org/draft-06/schema#',
        additionalProperties: false,
        properties: {
            name: {
                $id: '/properties/name',
                type: 'string',
                title: 'The Name Schema ',
                default: '',
                examples: [
                    'config',
                ],
            },
            applicationStructure: {
                $id: '/properties/applicationStructure',
                type: 'string',
                title: 'The Projecttype Schema ',
                default: '',
                examples: [
                    'deployment',
                ],
            },
            defaultEnvironment: {
                $id: '/properties/defaultEnvironment',
                type: 'string',
                title: 'The Defaultenvironment Schema ',
                default: '',
                examples: [
                    'dev',
                ],
            },
            displayCommandsOutput: {
                $id: '/properties/displayCommandsOutput',
                type: 'boolean',
                title: 'The DisplayCommandsOutput Schema ',
                default: false,
                examples: [
                    false,
                ],
            },
            scripts: {
                $id: '/properties/scripts',
                type: 'object',
                additionalProperties: true,
                properties: {},
            },
            docker: {
                $id: '/properties/docker',
                type: 'array',
                items: {
                    $id: '/properties/docker/items',
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                        imageName: {
                            $id: '/properties/docker/properties/imageName',
                            type: 'string',
                            title: 'The Containername Schema ',
                            default: '',
                            examples: [
                                'deployment-with-docker-file',
                            ],
                        },
                        tag: {
                            $id: '/properties/docker/properties/tag',
                            type: 'string',
                            title: 'The Tag Schema ',
                            default: '',
                            examples: [
                                '0.1',
                            ],
                        },
                        push: {
                            $id: '/properties/docker/properties/push',
                            type: 'boolean',
                            title: 'The Push Schema ',
                            default: false,
                            examples: [
                                true,
                            ],
                        },
                        buildDirectory: {
                            $id: '/properties/docker/properties/buildDirectory',
                            type: 'string',
                            title: 'The Builddirectory Schema ',
                            default: '',
                            examples: [
                                './path/to/docker/build',
                            ],
                        },
                    },
                    required: [
                        'imageName',
                        'tag',
                        'push',
                        'buildDirectory',
                    ],
                },
            },
            deployment: {
                $id: '/properties/deployment',
                type: 'object',
                additionalProperties: false,
                properties: {
                    roots: {
                        $id: '/properties/deployment/properties/roots',
                        type: 'array',
                        items: {
                            $id: '/properties/deployment/properties/roots/items',
                            type: 'string',
                            title: 'The 0th Schema ',
                            default: '',
                            examples: [
                                '.',
                                './second/dir',
                            ],
                        },
                    },
                },
                required: [
                    'roots',
                ],
            },
            helm: {
                $id: '/properties/helm',
                type: 'object',
                additionalProperties: false,
                properties: {
                    releaseName: {
                        $id: '/properties/helm/properties/releaseName',
                        type: 'string',
                        title: 'The Releasename Schema ',
                        default: '',
                        examples: [
                            'gitlab-dev',
                        ],
                    },
                },
                required: [
                    'releaseName',
                ],
            },
            ansible: {
                $id: '/properties/ansible',
                type: 'object',
                properties: {
                    inventoryDirectory: {
                        $id: '/properties/ansible/properties/inventoryDirectory',
                        type: 'string',
                    },
                    playbooks: {
                        $id: '/properties/ansible/properties/playbooks',
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                            deploy: {
                                $id: '/properties/ansible/properties/playbooks/deploy',
                                type: 'string',
                            },
                            destroy: {
                                $id: '/properties/ansible/properties/playbooks/destroy',
                                type: 'string',
                            },
                        },
                        required: [
                            'deploy',
                            'destroy',
                        ],
                    },
                },
                required: [
                    'playbooks',
                ],
            },
            hooks: {
                $id: '/properties/hooks',
                type: 'object',
                additionalProperties: false,
                properties: {
                    preBuild: {
                        $id: '/properties/hooks/properties/preBuild',
                        type: 'string',
                        title: 'The Prebuild Schema ',
                        default: '',
                        examples: [
                            './pre-build.sh',
                        ],
                    },
                    preDeploy: {
                        $id: '/properties/hooks/properties/preDeploy',
                        type: 'string',
                        title: 'The Predeploy Schema ',
                        default: '',
                        examples: [
                            './pre-deploy.sh',
                        ],
                    },
                    postDeploy: {
                        $id: '/properties/hooks/properties/postDeploy',
                        type: 'string',
                        title: 'The Postdeploy Schema ',
                        default: '',
                        examples: [
                            './post-deploy.sh',
                        ],
                    },
                    preDestroy: {
                        $id: '/properties/hooks/properties/preDestroy',
                        type: 'string',
                        title: 'The Predestroy Schema ',
                        default: '',
                        examples: [
                            './pre-destroy.sh',
                        ],
                    },
                    postDestroy: {
                        $id: '/properties/hooks/properties/postDestroy',
                        type: 'string',
                        title: 'The Postdestroy Schema ',
                        default: '',
                        examples: [
                            './post-destroy.sh',
                        ],
                    },
                },
            },
        },
        required: [
            'applicationStructure',
        ],
    };
}

