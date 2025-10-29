#!/usr/bin/env bash

mysql --user=root --password="$MYSQL_ROOT_PASSWORD" <<-EOSQL
    CREATE DATABASE IF NOT EXISTS rental-place;
    GRANT ALL PRIVILEGES ON \`locabu%\`.* TO '$MYSQL_USER'@'%';
EOSQL
