#!/usr/bin/env bash

# this script requires fzf

# import other scripts
source scripts/colors.sh
source scripts/cypress/check-git.sh
source scripts/cypress/handle-args.sh

PROJECT=apps/web-e2e
SPEC_DIR=cypress/integration
CONFIG=cypress.config.js
RUN=true

cyan() {
  printf "${_C_}${1}${_N_}\n\n"
}
warn() {
  printf "${_Y_}${1}${_N_}\n\n"
}

FORCE=false
ALL=false

# read the flags
handle_flag_args $@
set -- "${POSITIONAL_ARGS[@]}" # restore positional parameters

# if no positional args are provided, this script does nothing,
# so send the help text for user guidance
[ -z $1 ] && cat scripts/cypress/help.txt && exit 0

[ $2 ] && cyan "Only one positional arg is supported." && exit 1

# read the rest of the args
# post-processing functions and their calls are found in here
handle_positional_args $@
