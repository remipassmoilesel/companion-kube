module.exports = {
    applicationStructure: 'deployment',
    defaultEnvironment: 'dev',
    dockerImages: [{
        imageName: 'deployment-with-dockerfile',
        tag: '0.1',
        push: false,
        buildDirectory: './docker-image'
    }],
    scripts: {
        buildDev: 'docker build ./docker-image -t deployment-with-dockerfile:0.1',
        dev: 'ck run buildDev && docker run -p 8080:80 deployment-with-dockerfile',
        buildMinikube: 'eval $(minikube docker-env) && ck run buildDev'
    }
};