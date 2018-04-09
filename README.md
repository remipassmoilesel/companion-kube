# companion-kube

## Introduction

Mass deployment tool for Kubernetes deployments and charts. 
The applications to manage must be described using a `ck-config.js` file.

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
                                                        

