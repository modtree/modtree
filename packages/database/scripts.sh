#!/usr/bin/env bash

# restore the database which the test server queries
NODE_ENV=test yarn ts-node ./tests/server/restore.ts

# start the server and run the tests

BUILD_COMMAND="yarn dev:test"
TEST_COMMAND="yarn tconf:server"
HOST=http://localhost:8080 

yarn start-server-and-test \
  \'$BUILD_COMMAND\' \
  $HOST \
  \'$TEST_COMMAND\'
  
