#!/usr/bin/env bash

# Migration step 1/2:
#  -> generate the migration file
#     run the migration file
#
# creates a TypeScript file that contains TypeORM SQL queries
# that upon running, executes a migration.

# npm's TypeORM binary, because ts-node has issues resolving this
TYPEORM=node_modules/.bin/typeorm

# general configs
REPO=libs/typeorm-config
TSCONFIG=$REPO/tsconfig.lib.json

# target destination of TypeScript file to be created
SNAPSHOTS=$REPO/migrations

# suffix of the TypeScript file to be created
SUFFIX=untitled

yarn ts-node --project $TSCONFIG \
  -r tsconfig-paths/register \
  $TYPEORM migration:generate \
  -d $REPO/src/migration/config.ts \
  $SNAPSHOTS/$SUFFIX $@
