
module.exports = {
  "name": "config",
  "applicationStructure": "deployment",
  "defaultEnvironment": "dev",
  "helm": {
    "releaseName": "gitlab-dev"
  },
  "docker": {
    "containerName": "deployment-with-docker-file",
    "tag": "0.1",
    "push": true,
    "build": true,
    "buildDirectory": "./path/to/docker/build"
  },
  "scripts": {
    "build": "./build --fancy application",
    "run": "./run --without-bug application"
  }
}
