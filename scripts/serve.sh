#!/usr/bin/env sh

cleanup() {
  killall node
  echo "All node processes have been stopped."
}
trap cleanup EXIT

# run web server in the background
yarn dev:web &

# runs server in the foreground
# (CTRL-C) kill this particular process
yarn dev:server
