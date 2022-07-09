#!/usr/bin/env bash

yarn ts-node \
  --project libs/typeorm-config/tsconfig.lib.json \
  -r tsconfig-paths/register \
  libs/typeorm-config/src/test-connect.ts
