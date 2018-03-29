#!/usr/bin/env bash

git submodule init
git submodule update

npm install
npm run clean-compile
npm link