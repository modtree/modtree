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

SERVER=./apps/server
WEB=./apps/web
[[ $USER == "khang" ]]   && SRC=~/dots/personal/.secrets/modtree
[[ $USER == "weiseng" ]] && SRC=$REPOS/orbital/env

# weiseng's config

weiseng_env() {
  cp $SRC/.env* $WEB
  cp $SRC/admin.config.json .
}

weiseng_inv() {
  mkdir -p $SRC/web
  mkdir -p $SRC/database
  cp admin.config.json $SRC
  cp $WEB/.env.local $WEB/.env.example $SRC/web
}

# khang's config

khang_env() {
  # ln -sf $SRC/web/.env.local $WEB/.env.local
  # ln -sf $SRC/admin.config.json ./admin.config.json
  ln -sf $SRC/server/.env .
  ln -sf $SRC/.env.production .
}

khang_inv() {
  echo "nothing happened."
}

# fancy

env_start() {
 	printf "\n${_S_}[installing .env files]${_N_}\n"
 	printf "${_G_}source:${_N_} $SRC\n"
}

env_end() {
  [ -f $SERVER/.env ] \
    && [ -f $WEB/.env.local ] \
    && printf "📦  Env files loaded.\n\n"
}

inv_start() {
 	printf "\n${_S_}[saving .env files]${_N_}\n"
 	printf "${_G_}target:${_N_} $SRC\n"
}

inv_end() {
  printf "📦  Env files saved.\n\n"
}

setup() {
  yarn husky install
  env_start
  eval ${USER}_env
  env_end
}

inverse() {
  inv_start
  eval ${USER}_inv
  inv_end
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
  [ -z $SRC ] && return 0
  local cmd="$1"
  [[ $cmd == "setup" ]] && setup && return
  [[ $cmd == "inverse" ]] && inverse && return
  [[ $cmd == "rg-tests" ]] && rg_tests && return
  [[ $cmd == "rg-imports" ]] && rg_imports && return
  return 0
}

handle_args $@
