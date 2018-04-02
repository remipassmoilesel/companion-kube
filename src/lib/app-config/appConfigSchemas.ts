
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
            docker: {
                $id: '/properties/docker',
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
            scripts: {
                $id: '/properties/scripts',
                type: 'object',
                additionalProperties: true,
                properties: {

                },
            },
            ansible: {
                $id: '/properties/ansible',
                type: 'object',
                properties: {
                    playbooks: {
                        $id: '/properties/ansible/properties/playbooks',
                        type: 'object',
                        additionalProperties: true,
                        properties: {},
                    },
                },
            },
        },
        required: [
            'applicationStructure',
        ],
    };
}

