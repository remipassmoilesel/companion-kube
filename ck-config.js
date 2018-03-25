
module.exports = {
  "systemComponent": false,
  "configPath": "/path/to/config",
  "rootPath": "/path/to/",
  "name": "config",
  "projectType": "deployment",
  "helm": {
    "releaseName": "gitlab-dev"
  },
  "docker": {
    "containerName": "deployment-with-docker-file",
    "tag": "0.1",
    "push": true,
    "build": true,
    "buildDirectory": "./path/to/docker/build"
  }
}
