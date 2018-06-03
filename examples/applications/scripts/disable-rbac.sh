#!/bin/bash

# mercredi 4 avril 2018, 22:23:52 (UTC+0200)
kubectl create clusterrolebinding permissive-binding \
	  --clusterrole=cluster-admin \
	  --user=admin \
	  --user=kubelet \
	  --group=system:serviceaccounts
