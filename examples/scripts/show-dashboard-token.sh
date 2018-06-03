#!/bin/bash

# mardi 3 avril 2018, 19:22:50 (UTC+0200)

kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep admin-user | awk '{print $1}')

