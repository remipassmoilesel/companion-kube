module.exports = {
    applicationStructure: 'ansible',
    defaultEnvironment: 'dev',
    ansible: {
        playbooks: {
            deploy: '#/scripts/kubespray/cluster.yml',
            destroy: '#/scripts/kubespray/reset.yml --extra-vars "reset_confirmation=yes"',
        }
    },
};