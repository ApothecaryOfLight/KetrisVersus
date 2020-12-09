sudo apt-get update -y && sudo apt-get upgrade -y
curl -sL https://deb.nodesource.com/setup_15.x | sudo -E bash -
sudo apt-get install nodejs -y
sudo iptables -A PREROUTING -t nat -p tcp --dport 80 -j REDIRECT --to-ports 8080
screen -d -m -S chat_backend bash -c 'cd backend && npm i && ./run.sh'
screen -d -m -S content bash -c 'cd frontend && npm i && ./run.sh'
screen -d -m -S ketris_backend bash -c 'cd ketris-backend && npm i && ./run.sh'
sudo apt install mysql-server -y
sudo mysql_secure_installation
echo -e "CREATE DATABASE ketris_db;\nCREATE USER 'ketris_node_user'@'localhost' IDENTIFIED BY 'ketris_node_user_password';\nGRANT ALL ON ketris_db.* TO 'ketris_node_user'@'localhost';\nUSE ketris_db;\nCREATE TABLE ketris_users ( username_hash BINARY(16) NOT NULL, password_hash BINARY(16) NOT NULL, username_plaintext VARCHAR(256) NOT NULL, account_creation DATETIME NOT NULL, last_login DATETIME, PRIMARY KEY( username_hash ) );\nCREATE TABLE ketris_matches ( posting_user BINARY(16) NOT NULL, accepting_user BINARY(16) NOT NULL, timestamp_start DATETIME NOT NULL, timestamp_end DATETIME NOT NULL, posting_user_score INT NOT NULL, accepting_user_score INT NOT NULL );\nCREATE TABLE ketris_messages ( author_name VARCHAR( 256 ) NOT NULL, message_body MEDIUMTEXT NOT NULL, timestamp DATETIME NOT NULL );" > ketris_sql_init.sql
sudo mysql -s < ketris_sql_init.sql
rm ketris_sql_init.sql
echo "Setup complete!"