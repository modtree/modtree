#!/usr/bin/env bash

yarn ts-node scripts/run-tests/run.ts $@

cleanup() {
  rm test.command
}; trap cleanup EXIT

source test.command
