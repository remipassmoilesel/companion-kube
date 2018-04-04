module.exports = {
    applicationStructure: 'chart',
    defaultEnvironment: 'services',
    helm: {
        releaseName: 'docker-registry-1.0'
    },
    scripts: {
        debug: 'helm install --dry-run --debug .'
    }
};