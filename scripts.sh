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
	cp $SRC/.env.local $WEB/.env.local
	cp $SRC/.env $SERVER/.env
}

weiseng_inv() {
	cp $WEB/.env.local $SRC/.env.local
	cp $SERVER/.env $SRC/.env
}

# khang's config

khang_env() {
 	cp $SRC/web/.env* $WEB
 	cp $SRC/database/.env* $SERVER
 	cp $SRC/nx-cloud.env .
}

khang_inv() {
  mkdir -p $SRC/web
  mkdir -p $SRC/database
  cp $WEB/.env.local $WEB/.env.example $SRC/web
  cp $SERVER/.env $SERVER/.env.example $SRC/database
 	cp ./nx-cloud.env $SRC
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

handle_args() {
  [ -z $SRC ] && return 0
  local cmd="$1"
  [[ $cmd == "setup" ]] && env_start; eval ${USER}_env; env_end; return
  [[ $cmd == "inverse" ]] && inv_start; eval ${USER}_inv; inv_end; return
  return 0
}

handle_args $@
