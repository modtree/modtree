#!/usr/bin/env bash

TARGET=test
SOURCE=../libs/sql/snapshots/mod3.sql
CONFIG=../admin.config.json

PASSWORD=$(cat $CONFIG | jq -r .${TARGET}.password)
USERNAME=$(cat $CONFIG | jq -r .${TARGET}.username)
HOST=$(cat $CONFIG | jq -r .${TARGET}.host)
DATABASE=$(cat $CONFIG | jq -r .${TARGET}.database)
PORT=$(cat $CONFIG | jq -r .${TARGET}.port)

PGPASSWORD=$PASSWORD psql \
  --username=$USERNAME \
  --host=$HOST \
  --port=$PORT \
  $DATABASE
