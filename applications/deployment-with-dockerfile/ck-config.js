module.exports = {
    applicationStructure: 'deployment',
    docker: {
        containerName: 'deployment-with-dockerfile',
        tag: '0.1',
        push: true,
        build: true,
        buildDirectory: '.',
    },
    scripts: {
        build: 'docker build . -t deployment-with-dockerfile:0.1',
        dev: 'ck run build && docker run -p 8080:80 deployment-with-dockerfile',
        minikubeBuild: 'eval $(minikube docker-env); ck run build',
    },
};