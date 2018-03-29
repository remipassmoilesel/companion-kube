module.exports = {
    applicationStructure: 'chart',
    helm: {
        releaseName: 'infra'
    },
    scripts: {
        debug: 'helm install --dry-run --debug .'
    }
};