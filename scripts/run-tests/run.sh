#!/usr/bin/env bash

echo $PWD

run_node() {
  echo "compiled test runner"
  node dist/scripts/run-tests $@
}

run_tsnode() {
  echo "ts-noded test runner"
  yarn ts-node scripts/run-tests/run.ts $@
}

if [ -f dist/scripts/run-tests/index.js ]; then
  run_node $@
else
  yarn test:build
  [ -f dist/scripts/run-tests/index.js ] \
    && run_node $@ \
    || run_tsnode $@
fi

cleanup() {
  rm -f test.command
}; trap cleanup EXIT

[ -f test.command ] && source test.command || exit 0
