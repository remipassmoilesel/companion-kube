export class AppConfigSchema {
    public schema = {
        $id: 'https://github.com/remipassmoilesel/companion-kube/app-config.json',
        type: 'object',
        additionalProperties: false,
        definitions: {},
        $schema: 'http://json-schema.org/draft-06/schema#',
        required: ['projectType'],
        properties: {
            projectType: {
                $id: '/properties/projectType',
                type: 'string',
                title: 'The Projecttype Schema ',
                default: '',
                examples: [
                    'deployment', 'chart',
                ],
            },
            docker: {
                $id: '/properties/docker',
                type: 'object',
                additionalProperties: false,
                required: ['build', 'containerName', 'tag'],
                properties: {
                    containerName: {
                        $id: '/properties/docker/properties/containerName',
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
                        title: 'The Build Schema ',
                        default: false,
                        examples: [
                            true, false,
                        ],
                    },
                    build: {
                        $id: '/properties/docker/properties/build',
                        type: 'boolean',
                        title: 'The Build Schema ',
                        default: false,
                        examples: [
                            true, false,
                        ],
                    },
                    buildDirectory: {
                        $id: '/properties/docker/properties/buildDirectory',
                        type: 'string',
                        title: 'The BuildDirectory Schema ',
                        default: '',
                        examples: [
                            './path/to/docker/dir',
                        ],
                    },
                },
            },
        },
    };
}

