#!/usr/bin/env sh

# build the cli if it's not built yet
[ -f dist/libs/cy-reporter/cli.js ] || yarn cy:build

# run the cli executable
node dist/libs/cy-reporter/cli.js $@
