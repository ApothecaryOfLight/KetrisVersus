#!/bin/bash
#Update system.
sudo apt-get update -y && sudo apt-get upgrade -y

#Install NodeJS
curl -sL https://deb.nodesource.com/setup_15.x | sudo -E bash -
sudo apt-get install nodejs -y
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 8080
sudo ufw allow 8081
sudo ufw allow 3000 #login/chat port.
sudo ufw allow 1337 #ketris game port.
sudo ufw enable

#Install MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

#Setup MySQL schema.
echo -e "CREATE DATABASE ketris_db;\nCREATE USER 'ketris_node_user'@'localhost' IDENTIFIED BY 'ketris_node_user_password';\nGRANT ALL ON ketris_db.* TO 'ketris_node_user'@'localhost';\nUSE ketris_db;\nCREATE TABLE ketris_users ( username_hash BINARY(16) NOT NULL, password_hash BINARY(16) NOT NULL, username_plaintext VARCHAR(256) NOT NULL, account_creation DATETIME NOT NULL, last_login DATETIME, PRIMARY KEY( username_hash ) );\nCREATE TABLE ketris_matches ( posting_user BINARY(16) NOT NULL, accepting_user BINARY(16) NOT NULL, timestamp_start DATETIME NOT NULL, timestamp_end DATETIME NOT NULL, posting_user_score INT NOT NULL, accepting_user_score INT NOT NULL );\nCREATE TABLE ketris_messages ( author_name VARCHAR( 256 ) NOT NULL, message_body MEDIUMTEXT NOT NULL, timestamp DATETIME NOT NULL );" > ketris_sql_init.sql
sudo mysql -s < ketris_sql_init.sql
rm ketris_sql_init.sql

#Replace IP in client-side scripts with this server's IP.
IP="$(dig +short myip.opendns.com @resolver1.opendns.com)"
cd ./frontend/content && sed -i "s/54.149.165.92/$IP/g" script.js
cd ./frontend/content && sed -i "s/54.149.165.92/$IP/g" script-ketris.js

echo -n "Prod or dev? (p/d)"
read prompt

if [ "$prompt" != "${prompt#[Pp]}" ] ;then
  echo "Setting up HTTPS for prod."

  sudo snap install --classic certbot
  sudo certbot certonly --standalone
  cp /etc/letsencrypt/live/ketris.net/fullchain.pem /home/ubuntu/KetrisVersus/fullchain.pem
  cp /etc/letsencrypt/live/ketris.net/privkey.pem /home/ubuntu/KetrisVersus/privkey.pem

  echo "const ip = \"wss://ketris.net:3000\";" > ./frontend/content/ip_file.js

  #Run detached screens for each NodeJS.
  screen -d -m -S chat_backend bash -c 'cd chat-backend && npm i && ./run-https.sh'
  screen -d -m -S content bash -c 'cd frontend && npm i && ./run-https.sh'
  screen -d -m -S ketris_backend bash -c 'cd ketris-backend && npm i && ./run-https.sh'
else
  echo "Setting up HTTP for dev"
  screen -d -m -S chat_backend bash -c 'cd chat-backend && npm i && ./run-http.sh'
  screen -d -m -S content bash -c 'cd frontend && npm i && ./run-http.sh'
  screen -d -m -S ketris_backend bash -c 'cd ketris-backend && npm i && ./run-http.sh'

  echo "const ip = \"ws://54.245.37.116:3000\";" >> ./frontend/content/ip_file.js
fi

sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8081
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 8080

#Done!
echo "Setup complete!"
