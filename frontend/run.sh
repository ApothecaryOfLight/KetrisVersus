#!/bin/bash

if [[ "$1" = "prod" ]];
then
  npx nodemon --watch content --watch . -e js,css,html main.js https
else
  npx nodemon --watch content --watch . -e js,css,html main.js
fi
