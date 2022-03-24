#!/bin/bash
cd "${0%/*}"
if [[ "$1" = "prod" ]];
then
  npx nodemon --watch . main.js https
else
  npx nodemon --watch . main.js
fi
