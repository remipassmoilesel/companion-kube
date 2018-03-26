module.exports = {
    applicationStructure: 'deployment',
    docker: {
        containerName: 'static-example-deployment',
        tag: '0.1',
        push: true,
        build: true,
        buildDirectory: '.',
    }
};