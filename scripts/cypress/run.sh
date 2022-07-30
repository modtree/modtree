#!/usr/bin/env bash

FZF_OPTS=(
  --color='pointer:green,header:white'
  --header='Pick one spec file to run:'
  --height=7
  --no-multi
  --no-mouse
  --reverse
  --no-info
)

fzf_get_target() {
  # change dir to enjoy a quicker search
  pushd $PROJECT >/dev/null
  TARGET=$(find $SPEC_DIR -type f -name '*.cy.ts' | fzf "${FZF_OPTS[@]}")
  popd >/dev/null
}

bash_get_target() {
  pushd $PROJECT/$SPEC_DIR >/dev/null
  printf "Pick one spec file to run: ${_S_}(tab complete is available)${_N_}\n"
  read -ep "$SPEC_DIR/" SPEC
  [ $SPEC ] && TARGET=$SPEC_DIR/$SPEC
  popd >/dev/null
}

get_target() {
  if command -v fzf &>/dev/null; then
    # use this if fzf is installed
    fzf_get_target
  else
    # else use bash
    bash_get_target
  fi
}

# use fzf to pick out a test to run
run_one() {
  get_target
  # run the test if something is selected
  if [ $TARGET ]; then
    printf "${_S_}Spec target: $TARGET\n\n${_N_}"
    NODE_NO_WARNINGS=1 node $PROJECT/reporters/cypress.js $PROJECT/$TARGET
  else
    printf 'No test selected.\n\n'
  fi
}

# run all tests
run_all() {
  cyan "Running all cypress tests. $(date +'%r')"
  NODE_NO_WARNINGS=1 node $PROJECT/reporters/cypress.js --all
}
