#!/bin/bash

if [[ "$1" = "standalone" ]];
then
  echo "Beginning KetrisVS standalone installation.";

  #Install NodeJS
  curl -sL https://deb.nodesource.com/setup_15.x | sudo -E bash -
  sudo apt-get install nodejs -y

  #Install NodeJS packages.
  cd chat_backend && npm i
  cd content && npm i
  cd ketris_backend && npm i

  #Open ports.
  sudo ufw allow 22
  sudo ufw allow 80
  sudo ufw allow 8080
  sudo ufw allow 8081
  sudo ufw allow 8002 #login/chat port.
  sudo ufw allow 1337 #ketris game port.
  sudo ufw enable

  #Install MySQL
  sudo apt install mysql-server -y
  sudo mysql_secure_installation

  #Setup MySQL schema.
  echo -e "CREATE DATABASE ketris_db;\nCREATE USER 'ketris_node_user'@'localhost' IDENTIFIED BY 'ketris_node_user_password';\nGRANT ALL ON ketris_db.* TO 'ketris_node_user'@'localhost';\nUSE ketris_db;\nCREATE TABLE ketris_users ( username_hash BINARY(16) NOT NULL, password_hash BINARY(16) NOT NULL, username_plaintext VARCHAR(256) NOT NULL, account_creation DATETIME NOT NULL, last_login DATETIME, PRIMARY KEY( username_hash ) );\nCREATE TABLE ketris_matches ( posting_user BINARY(16) NOT NULL, accepting_user BINARY(16) NOT NULL, timestamp_start DATETIME NOT NULL, timestamp_end DATETIME NOT NULL, posting_user_score INT NOT NULL, accepting_user_score INT NOT NULL );\nCREATE TABLE ketris_messages ( author_name VARCHAR( 256 ) NOT NULL, message_body MEDIUMTEXT NOT NULL, timestamp DATETIME NOT NULL );" > ketris_sql_init.sql
  sudo mysql -s < ketris_sql_init.sql
  rm ketris_sql_init.sql

  #Add prerouting.
  ##sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8081
  ##sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 8080

  echo "KetrisVS standalone installation complete!";
elif [[ "$1" = "unified" ]];
then
  echo "Beginning KetrisVS unified installation.";

  #Install NodeJS packages.
  cd chat_backend && npm i
  cd content && npm i
  cd ketris_backend && npm i

  #Open ports.
  sudo ufw allow 8080
  sudo ufw allow 8081
  sudo ufw allow 8002 #login/chat port.
  sudo ufw allow 1337 #ketris game port.

  #Setup MySQL schema.
  echo -e "CREATE DATABASE ketris_db;\nCREATE USER 'ketris_node_user'@'localhost' IDENTIFIED BY 'ketris_node_user_password';\nGRANT ALL ON ketris_db.* TO 'ketris_node_user'@'localhost';\nUSE ketris_db;\nCREATE TABLE ketris_users ( username_hash BINARY(16) NOT NULL, password_hash BINARY(16) NOT NULL, username_plaintext VARCHAR(256) NOT NULL, account_creation DATETIME NOT NULL, last_login DATETIME, PRIMARY KEY( username_hash ) );\nCREATE TABLE ketris_matches ( posting_user BINARY(16) NOT NULL, accepting_user BINARY(16) NOT NULL, timestamp_start DATETIME NOT NULL, timestamp_end DATETIME NOT NULL, posting_user_score INT NOT NULL, accepting_user_score INT NOT NULL );\nCREATE TABLE ketris_messages ( author_name VARCHAR( 256 ) NOT NULL, message_body MEDIUMTEXT NOT NULL, timestamp DATETIME NOT NULL );" > ketris_sql_init.sql
  sudo mysql -s < ketris_sql_init.sql
  rm ketris_sql_init.sql

  #Add prerouting.
  ##sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8081
  ##sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 8080

  echo "KetrisVS unified installation complete!"
else
  echo "Command line argument:";
  echo "  install.sh standalone";
  echo "    Will install KetrisVS with all dependencies.";
  echo "  install.sh unified";
  echo "    Will install just KetrisVS, without any dependencies.";
fi
