#!/usr/bin/env bash

git submodule init
git submodule update

./lib/prerequisites/install-kubespray-requirements.sh

npm install
npm run clean-compile
sudo npm link