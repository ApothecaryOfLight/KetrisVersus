#!/bin/bash
cd "${0%/*}"

#Setup MySQL schema.
echo "CREATE DATABASE ketris_db;" >> "ketris_sql_init.sql"
echo "CREATE USER 'ketris_node_user'@'localhost' IDENTIFIED BY 'ketris_node_user_password';" >> "ketris_sql_init.sql"
echo "GRANT ALL ON ketris_db.* TO 'ketris_node_user'@'localhost';" >> "ketris_sql_init.sql"
echo "USE ketris_db;" >> "ketris_sql_init.sql"
echo "CREATE TABLE ketris_users ( username_hash BINARY(16) NOT NULL, password_hash BINARY(16) NOT NULL, username_plaintext VARCHAR(256) NOT NULL, account_creation_time TINYTEXT NOT NULL, last_login DATETIME(6), PRIMARY KEY( username_hash ) );" >> "ketris_sql_init.sql"
echo "CREATE TABLE ketris_matches ( posting_user BINARY(16) NOT NULL, accepting_user BINARY(16) NOT NULL, timestamp_start DATETIME(6) NOT NULL, timestamp_end DATETIME(6) NOT NULL, posting_user_score INT NOT NULL, accepting_user_score INT NOT NULL );" >> "ketris_sql_init.sql"
echo "CREATE TABLE ketris_messages ( author_name VARCHAR( 256 ) NOT NULL, message_body MEDIUMTEXT NOT NULL, timestamp DATETIME(6) NOT NULL );" >> "ketris_sql_init.sql"
echo "CREATE TABLE error_log( error_id INT NOT NULL, PRIMARY KEY(error_id), timestamp DATETIME(6) NOT NULL, ip TINYTEXT, severity TINYINT, source VARCHAR(256), message TEXT NOT NULL, details JSON );" >> "ketris_sql_init.sql"
echo "CREATE TABLE event_log( event_id INT NOT NULL, PRIMARY KEY(event_id), timestamp DATETIME(6) NOT NULL, ip TINYTEXT, code_source VARCHAR(256), message TEXT NOT NULL, details JSON );" >> "ketris_sql_init.sql"

#ID Manager
echo "USE ketris_db;" >> "ketris_sql_init.sql"
echo "CREATE TABLE sequence_last( sequence_id TINYINT, last BIGINT NOT NULL );" >> "ketris_sql_init.sql"
echo "CREATE TABLE sequence_retired( sequence_id TINYINT, retired_id BIGINT NOT NULL );" >> "ketris_sql_init.sql"
echo "INSERT INTO sequence_last (sequence_id,last) VALUES (0,0);" >> "ketris_sql_init.sql"
echo "INSERT INTO sequence_last (sequence_id,last) VALUES (1,0);" >> "ketris_sql_init.sql"
echo "INSERT INTO sequence_last (sequence_id,last) VALUES (2,0);" >> "ketris_sql_init.sql"
echo "INSERT INTO sequence_last (sequence_id,last) VALUES (3,0);" >> "ketris_sql_init.sql"
echo "INSERT INTO sequence_last (sequence_id,last) VALUES (4,0);" >> "ketris_sql_init.sql"

echo "DELIMITER %%" >> "ketris_sql_init.sql"
echo "CREATE FUNCTION ketris_db.generate_new_id( in_sequence_id TINYINT )" >> "ketris_sql_init.sql"
echo "RETURNS BIGINT" >> "ketris_sql_init.sql"
echo "NOT DETERMINISTIC" >> "ketris_sql_init.sql"
echo "CONTAINS SQL" >> "ketris_sql_init.sql"
echo "READS SQL DATA" >> "ketris_sql_init.sql"
echo "BEGIN" >> "ketris_sql_init.sql"
echo "DECLARE RetiredID BIGINT;" >> "ketris_sql_init.sql"
echo "DECLARE LastID BIGINT;" >> "ketris_sql_init.sql"
echo "SET @RetiredID = (SELECT retired_id FROM sequence_retired WHERE sequence_id = in_sequence_id LIMIT 1);" >> "ketris_sql_init.sql"
echo "SET @LastID = (SELECT last FROM sequence_last WHERE sequence_id = in_sequence_id LIMIT 1);" >> "ketris_sql_init.sql"
echo "IF @RetiredID IS NULL THEN UPDATE sequence_last SET last = last + 1 WHERE sequence_id = in_sequence_id;" >> "ketris_sql_init.sql"
echo "ELSE DELETE FROM sequence_retired WHERE retired_id = @RetiredID AND sequence_id = in_sequence_id;" >> "ketris_sql_init.sql"
echo "END IF;" >> "ketris_sql_init.sql"
echo "SET @NewID = COALESCE( @RetiredID, @LastID );" >> "ketris_sql_init.sql"
echo "RETURN @NewID;" >> "ketris_sql_init.sql"
echo "END" >> "ketris_sql_init.sql"
echo "%%" >> "ketris_sql_init.sql"
echo "DELIMITER ;" >> "ketris_sql_init.sql"

sudo mysql -s < ketris_sql_init.sql
rm ketris_sql_init.sql