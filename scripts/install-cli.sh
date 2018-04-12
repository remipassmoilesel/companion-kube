#!/usr/bin/env bash

git submodule init
git submodule update

./scripts/prerequisites/kubespray-requirements.sh

npm install
npm run clean-compile
npm link