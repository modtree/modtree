#!/usr/bin/env bash

function setup() {
  # get this script's filename
  SCRIPTNAME=`basename "$0"`
  # get this script's parent directory
  DATABASE_ROOT="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
  # where all existing migrations are
  MIGRATION_DIR=$DATABASE_ROOT/src/migrations
  # create temporary working dir
  TMP=$MIGRATION_DIR/tmp
  # obliterate tmp dir upon early exit
  function cleanup() {
    rm -rf $TMP
  }
  trap cleanup EXIT
  # clear the temporary directory
  rm -rf $TMP
  mkdir -p $TMP
  # grab the date
  DATE=$(date +'%Y-%m-%d_%R:%S')
}

# to use in development, to override all existing migration .ts files
# with just one big one
function destructive_migrate() {
  echo "destructive_migrate"
  RESTORE_SOURCE=$RESTORE_SOURCE yarn restore:file
  rm $MIGRATION_DIR/*.ts
  yarn typeorm:ds migration:generate $TMP/$NAME
  mv $TMP/* $MIGRATION_DIR/${NAME}_${DATE}.ts
}

# to use in production
function incremental_migrate() {
  echo 'incremental_migrate'
  yarn typeorm:ds migration:generate $TMP/$NAME
  mv $TMP/* $MIGRATION_DIR/${NAME}_${DATE}.ts
}

function migrate() {
  [[ "$OVERRIDE_ALL" == "true" ]] \
    && destructive_migrate \
    || incremental_migrate
}

# CONFIGS
RESTORE_SOURCE=modules-only.sql
OVERRIDE_ALL=true
NAME="migration"

# MAIN
setup
migrate
