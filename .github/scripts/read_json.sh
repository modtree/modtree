#!/usr/bin/env bash

[[ $EVENT == 'push' && $REF == 'refs/heads/main' ]] &&
  is_push_to_main=true ||
  is_push_to_main=false

echo "event:           $EVENT"
echo "ref:             $REF"
echo "is push to main: $is_push_to_main"

set_output() {
  local JSON=$(jq -rc "$1" .github/scripts/ci.json)
  echo "::set-output name=$2::$JSON"
}

# install environment
set_output '.install.command' 'install_command'

# build environment
set_output '.build.command' 'build_command'

# test environment
set_output '.test.command' 'test_command'
set_output '.test.prefix | join(" ")' 'test_prefix'
set_output '.test.projects' 'test_projects'
set_output '.build.args | join(" ")' 'build_args'
set_output '.test.args | join(" ")' 'test_args'
