#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

cd $SCRIPT_DIR/..

# forcefully stop all node processes
# note that this kills your LSP instance too
killall node

# serves frontend + server
yarn serve
