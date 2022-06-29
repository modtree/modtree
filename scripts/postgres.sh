#!/usr/bin/env bash

TARGET=development
SOURCE=../libs/sql/snapshots/mod3.sql
CONFIG=../admin.config.json

PASSWORD=$(cat $CONFIG | jq -r .${TARGET}.password)
USERNAME=$(cat $CONFIG | jq -r .${TARGET}.username)
HOST=$(cat $CONFIG | jq -r .${TARGET}.host)
DATABASE=$(cat $CONFIG | jq -r .${TARGET}.database)

remote_restore() {
  PGPASSWORD=$PASSWORD psql --username=$USERNAME --host=$HOST \
    $DATABASE < $SOURCE
}

local_restore() {
  psql $DATABASE < $SOURCE
}

remote_drop_all_tables() {
  PGPASSWORD=$PASSWORD psql --username=$USERNAME --host=$HOST \
    $DATABASE < commands.sql
}

local_drop_all_tables() {
  psql $DATABASE < commands.sql
}

main() {
  remote_drop_all_tables
  remote_restore
  # local_drop_all_tables
  # local_restore
}

main

# postgres cli: Delete an entry/row
# delete from "user" where id = '2bcff5a5-b03f-43f1-9a03-609dd252d111';
