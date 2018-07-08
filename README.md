# companion-kube

[![Build Status](https://travis-ci.org/remipassmoilesel/companion-kube.svg?branch=master)](https://travis-ci.org/remipassmoilesel/companion-kube)

[![Coverage Status](https://coveralls.io/repos/github/remipassmoilesel/companion-kube/badge.svg?branch=master)](https://coveralls.io/repos/github/remipassmoilesel/companion-kube/badge.svg?branch=master)

**⚠️ This application is experimental and under construction ⚠️**️️ 


## Introduction

Mass deployment tool for Kubernetes deployments and charts. 

With companion-kube, you can build a Docker image, push it via SSH or a Docker registry to a group of servers, 
then deploy it on a Kubernetes cluster with a single command. companion-kube can be used too for deploying a 
Kubernetes cluster with [kubespray](https://github.com/kubernetes-incubator/kubespray)


## Installation

    $ git clone https://github.com/remipassmoilesel/companion-kube
    $ cd companion-kube
    $ npm i
    $ npm run install-cli
    
Application is available as `companion-kube` or `ck`.


## Try it

Start dev cluster:

    $ cd companion-kube
    $ vagrant up
    
Install Kubernetes:
    
    $ cd examples 
    $ ck cluster deploy
    
Deploy services:

    $ ck svc deploy heapster
    $ ck svc deploy dashboard
    $ ck svc deploy tiller

Access dashboard:

    $ ck run dashboard

## How does it work
 
The applications to manage must be described using a `ck-config.js` file.
Complete example:
        
    module.exports = {
      "name": "application-name",
      "displayCommandsOutput": true,
      "applicationStructure": "deployment",
      "defaultEnvironment": "dev",
      "scripts": {
        "buildDev": "./build --fancy application",
        "runDev": "./run --without-bug application",
        "helmDebug": "helm install --dry-run --debug .",
        "kubectlDebug": "kubectl create -f . --dry-run"
      },
      "dockerImages": [
        {
          "imageName": "deployment-with-docker-file",
          "tag": "0.1",
          "push": true,
          "buildDirectory": "./path/to/docker/build"
        }
      ],
      "deployment": {
        "roots": [
          ".",
          "./second/dir"
        ]
      },
      "helm": {
        "releaseName": "gitlab-dev"
      },
      "ansible": {
        "inventoryDirectory": "./path/to/dir/",
        "playbooks": {
          "deploy": "#/lib/kubespray/cluster.yml",  // '#' means path is relative to companion-kube directory
          "destroy": "#/lib/kubespray/reset.yml"
        }
      },
      "hooks": {
        "preBuild": "./pre-build.sh",
        "preDeploy": "./pre-deploy.sh",
        "postDeploy": "./post-deploy.sh",
        "preDestroy": "./pre-destroy.sh",
        "postDestroy": "./post-destroy.sh"
      }
    }


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
                                                        

