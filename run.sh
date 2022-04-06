#!/bin/bash
cd "${0%/*}"
##  Run project.
##    run.sh http
##      Will run KetrisVS without an SSL/TSL Certificates.
##    run.sh https
##      Will run KetrisVS with SSL/TSL Certificates.

if [[ "$1" = "http" ]];
then
  IP=$(hostname -I | xargs)
  echo "const ip = \"ws://${2}\";" > ./frontend/ketris-javascript/ip_file.js
  screen -d -m -S ketris_chat bash -c 'cd chat-backend && ./run.sh http'
  screen -d -m -S ketris_admin bash -c 'cd admin-backend && ./run.sh http'
  screen -d -m -S ketris_backend bash -c 'cd ketris-backend && ./run.sh http'
elif [[ "$1" = "https" ]];
then
  echo "const ip = \"wss://ketris.net\";" > ./frontend/javascript/ip_file.js
  screen -d -m -S ketris_chat bash -c 'cd chat-backend && ./run.sh https'
  screen -d -m -S ketris_admin bash -c 'cd admin-backend && ./run.sh https'
  screen -d -m -S ketris_backend bash -c 'cd ketris-backend && ./run.sh https'
else
  echo "Command line argument:";
  echo "  run.sh dev";
  echo "    Will run KerisVS without an SSL/TSL Certificates.";
  echo "  run.sh prod";
  echo "    Will run KetrisVS with SSL/TSL Certificates.";
fi
