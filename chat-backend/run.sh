#!/bin/bash

if [[ "$1" = "https" ]];
then
  npx nodemon --watch . main.js https
else
  npx nodemon --watch . main.js
fi
