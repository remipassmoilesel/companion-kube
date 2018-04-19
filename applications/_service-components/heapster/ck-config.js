module.exports = {
    applicationStructure: 'chart',
    defaultEnvironment: 'kube-system',
    helm: {
        releaseName: 'dev'
    },
    scripts: {
        debug: 'helm install --dry-run --debug . | tee helm-debug.log'
    }
};