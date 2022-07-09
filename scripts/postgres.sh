#!/usr/bin/env bash

source ../.env

SOURCE=../libs/sql/snapshots/20220709.sql

PROD=true

if [[ $PROD == true ]]; then
  USERNAME=$PRODUCTION_POSTGRES_USERNAME
  HOST=$PRODUCTION_POSTGRES_HOST
  PASSWORD=$PRODUCTION_POSTGRES_PASSWORD
  DATABASE=$PRODUCTION_POSTGRES_DATABASE
  PORT=$PRODUCTION_POSTGRES_PORT
else
  USERNAME=$DEVELOPMENT_POSTGRES_USERNAME
  HOST=$DEVELOPMENT_POSTGRES_HOST
  PASSWORD=$DEVELOPMENT_POSTGRES_PASSWORD
  DATABASE=$DEVELOPMENT_POSTGRES_DATABASE
  PORT=$DEVELOPMENT_POSTGRES_PORT
fi

restore() {
  PGPASSWORD=$PASSWORD psql --username=$USERNAME --host=$HOST --port=$PORT \
    $DATABASE < $SOURCE
}

drop_all_tables() {
  PGPASSWORD=$PASSWORD psql --username=$USERNAME --host=$HOST --port=$PORT \
    $DATABASE < commands.sql
}

main() {
  # drop_all_tables
  restore
}

main

# postgres cli: Delete an entry/row
# delete from "user" where id = '2bcff5a5-b03f-43f1-9a03-609dd252d111';
