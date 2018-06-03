#!/bin/bash

# mardi 3 avril 2018, 21:57:33 (UTC+0200)

MASTER_ADRESS=BobosseLeBoss
REMOTE_CONFIG_PATH=/etc/kubernetes/admin.conf

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $SCRIPT_DIR

scp root@$MASTER_ADRESS:$REMOTE_CONFIG_PATH .

cd ~/.kube

cp config config-$(date +%Y%m%d_%H%M%S).bak

cp $SCRIPT_DIR/admin.conf config

