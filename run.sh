#!/bin/bash
##  Run project.
##    run.sh dev
##      Will run KetrisVS without an SSL/TSL Certificates.
##    run.sh prod
##      Will run KetrisVS with SSL/TSL Certificates.

if [[ "$1" = "dev" ]];
then
  echo "Running KetrisVS in development mode."
  IP=$(hostname -I | xargs)
  echo "const ip = \"ws://${IP}:3000\";" > ./frontend/content/ip_file.sh
  screen -d -m -S chat_backend bash -c 'cd chat-backend && ./run.sh dev'
  screen -d -m -S content bash -c 'cd frontend && ./run.sh dev'
  screen -d -m -S ketris_backend bash -c 'cd ketris-backend && ./run.sh dev'
elif [[ "$1" = "prod" ]];
then
  echo "Running KetrisVS in production mode."
  echo "const ip = \"wss://ketris.net:3000\";" > ./frontend/content/ip_file.sh
  screen -d -m -S chat_backend bash -c 'cd chat-backend && ./run.sh prod'
  screen -d -m -S content bash -c 'cd frontend && ./run.sh prod'
  screen -d -m -S ketris_backend bash -c 'cd ketris-backend && ./run.sh prod'
else
  echo "Command line argument:";
  echo "  run.sh dev";
  echo "    Will run KerisVS without an SSL/TSL Certificates.";
  echo "  run.sh prod";
  echo "    Will run KetrisVS with SSL/TSL Certificates.";
fi
