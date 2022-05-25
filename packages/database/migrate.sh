#!/usr/bin/env bash

# get this script's filename
SCRIPTNAME=`basename "$0"`
# get this script's parent directory
DATABASE_ROOT="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

MIGRATION_DIR=$DATABASE_ROOT/src/migrations
NAME="scripted-migration"
# NODE_ENV=migrate yarn mc
RESTORE_SOURCE=.test.sql yarn restore:file
# SYNCHRONIZE=true yarn typeorm_ds migration:generate $MIGRATION_DIR/
# mv $MIGRATION_DIR/*$NAME.ts $MIGRATION_DIR/$NAME.ts

