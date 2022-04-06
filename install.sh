#!/bin/bash
cd "${0%/*}"
if [[ "$1" = "standalone" ]];
then
  echo "Beginning KetrisVS standalone installation.";

  #Install NodeJS
  curl -sL https://deb.nodesource.com/setup_15.x | sudo -E bash -
  sudo apt-get install nodejs -y

  #Install NodeJS packages.
  cd chat_backend && npm i
  cd admin_backend && npm i
  cd ketris_backend && npm i

  #Open ports.
  sudo ufw allow 22
  sudo ufw allow 80
  sudo ufw allow 3002 #login/chat port.
  sudo ufw allow 3003 #ketris game port.
  sudo ufw allow 53004  #Ketris admin port.
  sudo ufw enable

  #Install MySQL
  sudo apt install mysql-server -y
  sudo mysql_secure_installation

  #Setup MySQL schema.
  ./ketris_sql_init.sh

  echo "KetrisVS standalone installation complete!";
elif [[ "$1" = "unified" ]];
then
  echo "Beginning KetrisVS unified installation.";

  #Install NodeJS packages.
  cd chat-backend && npm i
  cd admin_backend && npm i
  cd ketris-backend && npm i

  #Open ports.
  sudo ufw allow 3002 #login/chat port.
  sudo ufw allow 3003 #ketris game port.
  sudo ufw allow 53004  #Ketris admin port.

  #Setup MySQL schema.
  ./ketris_sql_init.sh

  echo "KetrisVS unified installation complete!"
else
  echo "Command line argument:";
  echo "  install.sh standalone";
  echo "    Will install KetrisVS with all dependencies.";
  echo "  install.sh unified";
  echo "    Will install just KetrisVS, without any dependencies.";
fi
