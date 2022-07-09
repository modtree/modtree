#!/usr/bin/env bash

# Pre-migration check
#
# Checks to see if there is an error when connecting to the database,
# and what error exactly.
#
# Chances are that if there's an error thrown, it's because the schema
# has changed and it's time for a migration.

# general configs
REPO=libs/typeorm-config
TSCONFIG=$REPO/tsconfig.lib.json

yarn ts-node --project $TSCONFIG \
  -r tsconfig-paths/register \
  $REPO/src/migration/test-connect.ts
