#!/usr/bin/env bash

typeorm=node_modules/.bin/typeorm
REPO=libs/typeorm-config

yarn ts-node \
  --project $REPO/tsconfig.lib.json \
  -r tsconfig-paths/register \
  $typeorm migration:generate \
  -d $REPO/src/migration.config.ts \
  $REPO/src/migrations/untitled
