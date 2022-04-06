#!/bin/bash
cd "${0%/*}"
if [[ "$1" = "https" ]];
then
  npx nodemon -e js main.js https
elif [[ "$1" = "http" ]];
then
  npx nodemon -e js main.js http
fi