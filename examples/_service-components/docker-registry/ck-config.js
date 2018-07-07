module.exports = {
    applicationStructure: 'chart',
    defaultEnvironment: 'services',
    helm: {
        releaseName: 'docker-registry'
    },
    scripts: {
        debug: 'helm install --dry-run --debug . | tee helm-debug.log'
    }
};