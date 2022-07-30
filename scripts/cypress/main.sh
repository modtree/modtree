#!/usr/bin/env bash

# this script requires fd and fzf

# import other scripts
source scripts/colors.sh
source scripts/cypress/run.sh
source scripts/cypress/check-git.sh

PROJECT=apps/web-e2e
SPEC_DIR=cypress/integration
CONFIG=cypress.config.js
RUN=true
pushd $PROJECT

cyan() {
  printf "\n${_C_}${1}${_N_}\n\n"
}

FORCE=false
ALL=false
handle_arguments() {
  while [[ $# -gt 0 ]]; do
    case $1 in
    -f | --force)
      FORCE=true
      shift
      ;;
    -a | --all)
      ALL=true
      shift
      ;;
    -* | --*)
      echo "Unknown option $1"
      exit 1
      ;;
    *)
      POSITIONAL_ARGS+=("$1") # save positional arg
      shift                   # past argument
      ;;
    esac
  done
}
handle_arguments $@
set -- "${POSITIONAL_ARGS[@]}" # restore positional parameters
[ $2 ] && cyan "Only one positional arg is supported." && exit 1

# after checking for clean git status, handle the rest of arguments
handle_positional_args() {
  case $1 in
  r | run)
    # check that git status is clean
    ensure_clean_git_status
    # if git status is clean, then execute runs
    if [[ $ALL == true ]]; then
      run_all
    else
      fzf_and_run
    fi
    ;;
  ls | list)
    node reporters/list.js
    ;;
  *)
    cyan "Unknown positional argument."
    exit 1
    ;;
  esac
}
handle_positional_args $@
