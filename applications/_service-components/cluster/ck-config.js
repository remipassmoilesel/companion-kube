module.exports = {
    applicationStructure: 'ansible',
    ansible: {
        playbooks: {
            deploy: {
                path: '#/scripts/kubespray/cluster.yml',
            },
            destroy: {
                path: '#/scripts/kubespray/reset.yml',
            },
            scale: {
                path: '#/scripts/kubespray/scale.yml',
            },
        }
    },
};