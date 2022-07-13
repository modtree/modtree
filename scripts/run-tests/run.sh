#!/usr/bin/env bash

yarn ts-node scripts/run-tests/run.ts $@

cleanup() {
  rm -f test.command
}; trap cleanup EXIT

[ -f test.command ] && source test.command || exit 0
