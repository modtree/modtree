#!/usr/bin/env bash

# this script requires fd and fzf

source scripts/colors.sh
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
      echo "Unknown option $1"
      exit 1
      ;;
    esac
  done
}
handle_arguments $@

# ensure a clean git status
while IFS= read -r line; do
  [[ $line != *'apps/web-e2e/results.json' ]] && RUN=false
done < <(git status --porcelain)

# warn user
[[ $RUN == false && $FORCE == false ]] &&
  cyan 'Please commit all changes before running tests.' && exit 1

# run all tests if specified so
if [[ $ALL == true ]]; then
  yarn cypress run -P $PROJECT -C $CONFIG
  exit
fi

# use fzf to pick out a test to run
TARGET=$(fd -t f -g '*.cy.ts' $SPEC_DIR | fzf)

# run the test if something is selected
if [ $TARGET ]; then
  yarn cypress run --quiet \
    --project $PROJECT \
    --config-file $CONFIG \
    --spec $PROJECT/$TARGET
else
  cyan 'No test selected.'
fi
