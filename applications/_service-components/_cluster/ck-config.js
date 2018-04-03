module.exports = {
    applicationStructure: 'ansible',
    defaultEnvironment: 'dev',
    ansible: {
        playbooks: {
            deploy: {
                path: '#/scripts/kubespray/cluster.yml',
            },
            destroy: {
                path: '#/scripts/kubespray/reset.yml --extra-vars "reset_confirmation=yes"',
            },
            scale: {
                path: '#/scripts/kubespray/scale.yml',
            },
        }
    },
};