module.exports = {
    projectType: 'deployment',
    docker: {
        containerName: 'deployment-with-docker-file',
        tag: '0.1',
        push: true,
        build: true,
        buildDirectory: '.',
    }
};