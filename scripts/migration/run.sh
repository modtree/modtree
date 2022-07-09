#!/usr/bin/env bash

# Migration step 2/2:
#     generate the migration file
#  -> run the migration file
#
# Looks inside of the DataSource object, and finds the migrations key.
#
# The value of this key will be an array of migrations.
#
# TypeORM will then run new migrations in that array.

# npm's TypeORM binary, because ts-node has issues resolving this
TYPEORM=node_modules/.bin/typeorm

# general configs
REPO=libs/typeorm-config
TSCONFIG=$REPO/tsconfig.lib.json

yarn ts-node --project $TSCONFIG \
  -r tsconfig-paths/register \
  $TYPEORM migration:run \
  -d $REPO/src/migration/config.ts
