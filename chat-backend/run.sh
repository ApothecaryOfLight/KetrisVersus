#!/bin/bash

if [[ "$1" = "prod" ]];
then
  npx nodemon --watch . main.js https
else
  npx nodemon --watch . main.js
fi
