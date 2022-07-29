#!/usr/bin/env bash

OUT=dist/out-tsc/libs/cy-reporter/src/*.js
DEST=apps/web-e2e/reporters

tsc -p libs/cy-reporter/tsconfig.lib.json
# mv $OUT $DEST
