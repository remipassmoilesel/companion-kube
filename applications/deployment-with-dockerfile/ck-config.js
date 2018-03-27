module.exports = {
    applicationStructure: 'deployment',
    docker: {
        containerName: 'static-example-deployment',
        tag: '0.1',
        push: true,
        build: true,
        buildDirectory: '.',
    },
    scripts: {
        build: 'docker build . -t deployment-with-dockerfile',
        launch: 'docker run -p 8080:80 deployment-with-dockerfile',
        'build-run': 'ck run build && ck run launch',
    }
};