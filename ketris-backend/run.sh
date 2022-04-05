#!/bin/bash
cd "${0%/*}"
if [[ "$1" = "https" ]];
then
  npx nodemon --watch . ketris-vs-server.js https
elif [[ "$1" = "http" ]];
then
  npx nodemon --watch . ketris-vs-server.js http
fi
