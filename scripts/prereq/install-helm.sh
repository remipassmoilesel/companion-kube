#!/usr/bin/env bash

cd /tmp

wget https://storage.googleapis.com/kubernetes-helm/helm-v2.8.2-linux-amd64.tar.gz -O helm.tar.gz

tar -xvf helm.tar.gz

chmod +x linux-amd64/helm
mv linux-amd64/helm /usr/local/bin