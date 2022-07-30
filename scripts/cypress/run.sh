#!/usr/bin/env bash

# run all tests
run_all() {
  yarn cypress run --quiet \
    --project $PROJECT \
    --config-file $CONFIG
}

fzf_and_run() {
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
}
