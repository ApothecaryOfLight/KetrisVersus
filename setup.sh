sudo apt-get update -y && sudo apt-get upgrade -y
sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password password your_password'
sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password your_password'
sudo apt install mysql-server -y
sudo systemctl enable mysql
echo -e "CREATE DATABASE ketris_db;\nCREATE USER 'ketris_node_user'@'localhost' IDENTIFIED BY 'ketris_node_user_password';\nGRANT ALL ON ketris_db.* TO 'ketris_node_user'@'localhost';\nUSE ketris_db;\nCREATE TABLE ketris_users ( username_hash BINARY(16) NOT NULL, password_hash BINARY(16) NOT NULL, username_plaintext VARCHAR(256) NOT NULL, account_creation DATETIME NOT NULL, last_login DATETIME, PRIMARY KEY( username_hash ) );\nCREATE TABLE ketris_matches ( posting_user BINARY(16) NOT NULL, accepting_user BINARY(16) NOT NULL, timestamp_start DATETIME NOT NULL, timestamp_end DATETIME NOT NULL, posting_user_score INT NOT NULL, accepting_user_score INT NOT NULL );\nCREATE TABLE ketris_messages ( author_name VARCHAR( 256 ) NOT NULL, message_body MEDIUMTEXT NOT NULL, timestamp DATETIME NOT NULL );" > ketris_sql_init.sql
mysql --user=root -s < ketris_sql_init.sql
rm ketris_sql_init.sql
curl -sL https://deb.nodesource.com/setup_15.x | sudo -E bash -
sudo apt-get install nodejs -y
