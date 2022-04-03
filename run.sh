#!/bin/bash
cd "${0%/*}"
##  Run project.
##    run.sh dev
##      Will run KetrisVS without an SSL/TSL Certificates.
##    run.sh prod
##      Will run KetrisVS with SSL/TSL Certificates.

if [[ "$1" = "http" ]];
then
  IP=$(hostname -I | xargs)
  echo "const ip = \"ws://${2}\";" > ./frontend/content/ip_file.js
  screen -d -m -S ketris_chat bash -c 'cd chat-backend && ./run.sh dev'
##  screen -d -m -S ketris_frontend bash -c 'cd frontend && ./run.sh dev'
  screen -d -m -S ketris_backend bash -c 'cd ketris-backend && ./run.sh dev'
elif [[ "$1" = "https" ]];
then
  echo "const ip = \"wss://ketris.net\";" > ./frontend/content/ip_file.js
  screen -d -m -S ketris_chat bash -c 'cd chat-backend && ./run.sh prod'
##  screen -d -m -S ketris_frontend bash -c 'cd frontend && ./run.sh prod'
  screen -d -m -S ketris_backend bash -c 'cd ketris-backend && ./run.sh prod'
else
  echo "Command line argument:";
  echo "  run.sh dev";
  echo "    Will run KerisVS without an SSL/TSL Certificates.";
  echo "  run.sh prod";
  echo "    Will run KetrisVS with SSL/TSL Certificates.";
fi
