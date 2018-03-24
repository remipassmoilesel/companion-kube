module.exports = {
    projectType: 'deployment',
    docker: {
        build: false,
        containerName: 'deployment-with-docker-file',
        tag: '0.1'
    }
};