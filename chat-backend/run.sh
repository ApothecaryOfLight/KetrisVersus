#!/bin/bash
cd "${0%/*}"
if [[ "$1" = "https" ]];
then
  npx nodemon --watch ../admin-backend/error-logging.js --watch . -e js main.js https
elif [[ "$1" = "http" ]];
then
  npx nodemon --watch ../admin-backend/error-logging.js --watch . -e js main.js http
fi
