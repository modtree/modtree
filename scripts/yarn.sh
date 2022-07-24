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

if [[ $USER == "khang" ]]; then
  SRC=$HOME/dots/personal/.secrets/modtree
  DOT_ENV=$SRC/.env
  WEB_E2E=$SRC/cypress.env.json
fi
if [[ $USER == "weiseng" ]]; then
  DOT_ENV=$REPOS/orbital/env/.env
  WEB_E2E=$REPOS/orbital/env/cypress.env.json
fi

env_start() {
  printf "\n${_S_}[installing .env files]${_N_}\n"
  printf "${_G_}.env:${_N_} $DOT_ENV\n"
}

env_install() {
  [ $DOT_ENV ] && ln -sf $DOT_ENV .
  [ $WEB_E2E ] && ln -sf $WEB_E2E ./apps/web-e2e
}

env_end() {
  # root-level .env file
  [ -f ./.env ] &&
    printf "\n${_G_} ✓ .env file loaded.${_N_}" ||
    printf "\n${_Y_} ✗ .env file not loaded.${_N_}"
  # web-e2e test-runner credentials
  [ -f ./apps/web-e2e/cypress.env.json ] &&
    printf "\n${_G_} ✓ cypress.env.json loaded.${_N_}" ||
    printf "\n${_Y_} ✗ cypress.env.json not loaded.${_N_}"
  printf "\n\n"
}

setup() {
  git config core.hooksPath scripts/.hooks
  env_start
  env_install
  env_end
}

rg_tests() {
  rg "^\s*(it|test|describe)\("
}

rg_imports() {
  # package json imports
  rg "\"@modtree/(\w|-)*\": \"\*\"" -g 'package.json'
  # code imports
  rg "'@modtree/(\w|-)*'" -g '!package.json'
}

handle_args() {
  [ -z $DOT_ENV ] && return 0
  local cmd="$1"
  [[ $cmd == "setup" ]] && setup && return
  [[ $cmd == "rg-tests" ]] && rg_tests && return
  [[ $cmd == "rg-imports" ]] && rg_imports && return
  return 0
}

handle_args $@
