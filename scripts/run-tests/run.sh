#!/usr/bin/env bash

# Reset
_N_='\033[0m'     # Reset
_R_='\033[0;31m'  # Red
_G_='\033[0;32m'  # Green
_Y_='\033[0;33m'  # Yellow
_B_='\033[0;34m'  # Blue
_P_='\033[0;35m'  # Purple
_C_='\033[0;36m'  # Cyan
_S_='\033[0;37m'  # Soft (Gray)

run_node() {
  printf "\n🚀 compiled test runner\n"
  node dist/scripts/run-tests $@
}

run_tsnode() {
  printf "\n🍙 ts-noded test runner\n"
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

[ -f test.command ] && source test.command
