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

[[ $USER == "khang" ]]   && DOT_ENV=$HOME/dots/personal/.secrets/modtree/.env
[[ $USER == "weiseng" ]] && DOT_ENV=$REPOS/orbital/env/.env

env_start() {
 	printf "\n${_S_}[installing .env files]${_N_}\n"
 	printf "${_G_}.env:${_N_} $DOT_ENV\n"
}

env_install() {
  ln -sf $DOT_ENV .
}

env_end() {
  [ -f ./.env ] \
    && printf "\n${_G_} ✓ .env file loaded.${_N_}" \
    || printf "\n${_Y_} ✗ .env file not loaded.${_N_}"
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
