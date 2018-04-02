module.exports = {
    applicationStructure: 'ansible',
    defaultEnvironment: 'dev',
    ansible: {
        playbooks: {
            deploy: {
                path: '#/scripts/kubespray/cluster.yml -vv',
            },
            destroy: {
                path: '#/scripts/kubespray/reset.yml -vv',
            },
            scale: {
                path: '#/scripts/kubespray/scale.yml -vv',
            },
        }
    },
};