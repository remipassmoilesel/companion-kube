#!/usr/bin/env bash

# See https://github.com/kubernetes/dashboard/wiki/Creating-sample-user

echo ""
echo ""
echo "Creating dashboard: "
kubectl create -f k8s-dashboard

echo ""
echo ""
echo "Identification token: "
kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep admin-user | awk '{print $1}')

echo ""
echo ""
echo "Visit: "
echo "https://MASTER_IP:6443/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/#!/login"