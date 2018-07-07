module.exports = {
    applicationStructure: 'chart',
    defaultEnvironment: 'kube-system',
    helm: {
        releaseName: 'heapster'
    },
    scripts: {
        debug: 'helm install --dry-run --debug . | tee helm-debug.log'
    }
};