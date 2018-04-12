# companion-kube

[![Build Status](https://travis-ci.org/remipassmoilesel/companion-kube.svg?branch=master)](https://travis-ci.org/remipassmoilesel/companion-kube)

[![Coverage Status](https://coveralls.io/repos/github/remipassmoilesel/companion-kube/badge.svg?branch=master)](https://coveralls.io/repos/github/remipassmoilesel/companion-kube/badge.svg?branch=master)

**⚠️⚠️⚠ This application is experimental and under construction ⚠️⚠️⚠***️️ 

## Introduction

Mass deployment tool for Kubernetes deployments and charts. 

With companion-kube, you can build a Docker image, push it via SSH or a Docker registry to a group of servers, 
then deploy it on a Kubernetes cluster with a single command. companion-kube can be used too for deploying a 
Kubernetes cluster with [kubespray](https://github.com/kubernetes-incubator/kubespray)

## How does it work
 
The applications to manage must be described using a `ck-config.js` file.
Complete example:
    
    module.exports = {
      "name": "application-name",
      "applicationStructure": "deployment",             // can be 'scripts' | 'deployment' | 'chart' | 'ansible'
      "defaultEnvironment": "dev",                      // optionnal environment to deploy on
      "scripts": {                              
        "buildDev": "./build --fancy application",      // scripts that can be run with ck run ...
        "runDev": "./run --without-bug application",
        "helmDebug": "helm install --dry-run --debug .",
        "kubectlDebug": "kubectl create -f . --dry-run"
      },
      "docker": {                                       // Docker build parameters
        "imageName": "deployment-with-docker-file",
        "tag": "0.1",
        "push": true,
        "buildDirectory": "./path/to/docker/build"
      },
      "deployment": {                                   // Kubernetes deployments directories
        "roots": [
          ".",
          "./second/dir"
        ]
      },
      "helm": {                                         // Helm chart parameters
        "releaseName": "gitlab-dev"
      },
      "ansible": {                                      // Ansible playbooks
        "playbooks": {
          "deploy": {
            "path": "#/scripts/kubespray/cluster.yml"
          },
          "destroy": {
            "path": "#/scripts/kubespray/reset.yml"
          },
          "scale": {
            "path": "#/scripts/kubespray/scale.yml"
          }
        }
      },
      "hooks": {                                        // Hook run on specific lifecycle steps
        "preDeploy": "./pre-deploy.sh",
        "postDeploy": "./post-deploy.sh",
        "preDestroy": "./pre-destroy.sh",
        "postDestroy": "./post-destroy.sh"
      }
    }



## Installation

    $ git clone https://github.com/remipassmoilesel/companion-kube
    $ cd companion-kube
    $ npm i
    $ npm run install-cli
    
Application is available as `companion-kube` or `ck`.

## Init an application

    user@host: ~/projects/companion-kube master ⚡
    $ 😛 companion-kube init      
    [~] Companion-Kube !
    
    [+] File ck-config.js created !
 
## Deploy all !

    user@host: ~/projects/companion-kube master ⚡                                     
    $ 😛 companion-kube deploy all
    [~] Companion-Kube !                                
    
    [~] Deploying deployment-with-dockerfile            
    [+] Finished !                                      
    [~] Deploying Chart helm-chart                      
    [+] Finished !                                      
    [~] Deploying simple-deployment                     
    [+] Finished ! 

## Destroy all !

    user@host: ~/projects/companion-kube master ⚡                                     
    $ 😛 companion-kube destroy all  
    [~] Companion-Kube !                                
    
    [~] Destroying deployment-with-dockerfile           
    [+] Finished !                                      
    [~] Destroying Chart helm-chart                     
    [+] Finished !                                      
    [~] Destroying simple-deployment                    
    [+] Finished !                                      
                                                        

