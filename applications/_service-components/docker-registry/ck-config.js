module.exports = {
    applicationStructure: 'chart',
    defaultEnvironment: 'services',
    helm: {
        releaseName: 'dev'
    },
    scripts: {
        debug: 'helm install --dry-run --debug .'
    }
};