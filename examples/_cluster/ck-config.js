module.exports = {
    applicationStructure: 'ansible',
    defaultEnvironment: 'dev',
    ansible: {
        playbooks: {
            deploy: '#/lib/kubespray/cluster.yml',
            destroy: '#/lib/kubespray/reset.yml --extra-vars "reset_confirmation=yes"',
        }
    },
};