# Fonctionnalités

ETQ dév, je veux déployer ou arrêter un groupe d'applications Kubernetes sous forme de:
- déploiement simples
- déploiement simples avec image docker à construire
- charts helm - Utiliser éventuellement seulement helm

ETQ dév, je veux déployer mes applications sur plusieurs environnements

ETQ dév, je veux lister les applications disponibles

ETQ dév, je veux utiliser une image docker sans pousser vers un registry
    
    kubectl run hello --image=datawire/hello-world-python --port=8080 --expose
   
ETQ dév, je veux pouvoir séparer les composants système Kubernetes de mes applications:
- ingress controller
- monitoring
- namespaces