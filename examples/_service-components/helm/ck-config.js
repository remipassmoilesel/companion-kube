module.exports = {
    applicationStructure: 'deployment',
    hooks: {
        postDeploy: 'helm init --service-account tiller',
        preDestroy: 'helm reset',
    }
};