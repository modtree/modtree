#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

cd $SCRIPT_DIR/..

# opens a new tmux window with two panes,
# one running yarn build, one running yarn test
tmux neww -n modtree_test "yarn build; $SHELL -i" \
  \; splitw -h "yarn test; $SHELL -i"
