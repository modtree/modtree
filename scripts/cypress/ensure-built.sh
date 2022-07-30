#!/usr/bin/env bash

BUILT=false
OUTDIR=dist/libs/cy-reporter
[ -f $OUTDIR/json.js ] &&
  [ -f $OUTDIR/sender.js ] &&
  [ -f $OUTDIR/list.js ] &&
  BUILT=true

if [[ $BUILT == false ]]; then
  echo "No binary found. Building it now..."
  node libs/cy-reporter/webpack.js --build
  printf "${_G_}Build complete.${_N_}\n"
fi
