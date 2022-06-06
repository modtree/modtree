#!/usr/bin/env bash

function get_test_cmd() {
  echo "yarn jest -c ./tests/configs/${1-database}.ts"
}

function run_database_tests() {
  exec $(get_test_cmd "database")
}

function run_server_tests() {
  # restore the database which the test server queries
  NODE_ENV=test yarn ts-node ./tests/server/restore.ts >/dev/null

  # configs for server test
  local PORT=8080
  local BUILD_COMMAND="yarn dev:test"
  local HOST=http://localhost:$PORT
  local TEST_COMMAND=$(get_test_cmd "server")

  # start the server and run the tests
  # note that server will automatically stop after tests are over
  yarn start-server-and-test \'$BUILD_COMMAND\' $HOST \'$TEST_COMMAND\'
}
  
function handle_arguments() {
  [ -z $1 ] && echo "No arguments provided" && exit 0
  [ "$1" = "database" ] && run_database_tests && return
  [ "$1" = "server" ] && run_server_tests && return
  echo "Invalid argument"
}

handle_arguments $@
