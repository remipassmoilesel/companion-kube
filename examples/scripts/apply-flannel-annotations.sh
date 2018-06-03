#!/usr/bin/env bash

# Comme le noeud est derrière un NAT, afficher l'adresse publique correcte

kubectl annotate --overwrite node bobosseleboss flannel.alpha.coreos.com/public-ip-overwrite=89.2.92.127