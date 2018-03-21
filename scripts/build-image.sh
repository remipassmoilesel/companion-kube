#!/usr/bin/env bash

source ./config.sh

cd ..

npm install
npm run clean-compile

docker build . -t $IMAGE_NAME:$TAG