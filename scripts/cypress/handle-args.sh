#!/usr/bin/env bash

source scripts/cypress/run.sh

handle_flag_args() {
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
    -af | -fa)
      ALL=true
      FORCE=true
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

handle_positional_args() {
  case $1 in
  r | run)
    # check that git status is clean
    ensure_clean_git_status

    # if git status is clean, then execute runs
    if [[ $ALL == true ]]; then
      run_all
    else
      run_one
    fi
    ;;
  ra | run-all)
    ALL=true
    ensure_clean_git_status
    run_all
    ;;
  ls | list)
    node $PROJECT/reporters/list.js
    ;;
  *)
    cyan "Unknown positional argument."
    exit 1
    ;;
  esac
}
