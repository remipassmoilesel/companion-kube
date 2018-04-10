module.exports = {
    applicationStructure: 'chart',
    defaultEnvironment: 'dev',
    helm: {
        releaseName: 'chart-example'
    },
    scripts: {
        debug: 'helm install --dry-run --debug . | tee helm-debug.log'
    }
};