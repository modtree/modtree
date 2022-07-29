#!/usr/bin/env bash

# Reset
_N_='\033[0m'    # Reset
_R_='\033[0;31m' # Red
_G_='\033[0;32m' # Green
_Y_='\033[0;33m' # Yellow
_B_='\033[0;34m' # Blue
_P_='\033[0;35m' # Purple
_C_='\033[0;36m' # Cyan
_S_='\033[0;37m' # Soft (Gray)

RUN=true
while IFS= read -r line; do
  [[ $line != *'apps/web-e2e/results.json' ]] && RUN=false
done < <(git status --porcelain)

[[ "$RUN" == false ]] &&
  printf "\n${_C_}Please commit all changes before running tests.${_N_}\n\n" &&
  exit 1

SPEC_DIR=apps/web-e2e/cypress/integration

# this script requires fd and fzf

if [[ $1 = '--all' ]]; then
  yarn nx e2e web-e2e --skip-nx-cache
  exit
fi
TARGET=$(fd --full-path $SPEC_DIR -t f | fzf)

if [ $TARGET ]; then
  yarn nx e2e web-e2e --skip-nx-cache --spec $TARGET
else
  printf "\n${_C_}No test selected.${_N_}\n\n"
fi
