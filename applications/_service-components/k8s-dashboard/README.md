# K8S Dashboard deployment

See identification token:

    $ kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep admin-user | awk '{print $1}')

Connect to dashboard:

    $ kubectl proxy

Then visit: http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/