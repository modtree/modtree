#!/usr/bin/env bash

[[ $EVENT == 'push' && $REF == 'refs/heads/main' ]] \
  && is_push_to_main=true \
  || is_push_to_main=false

echo "event:           $EVENT"
echo "ref:             $REF"
echo "is push to main: $is_push_to_main"

set_output() {
  local JSON=`jq -rc "$1" .github/scripts/ci.json`
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

# action-dependent environment
if [ "$is_push_to_main" = true ]; then
  set_output '.build.args.no_cache | join(" ")' 'build_args'
  set_output '.test.args.no_cache | join(" ")' 'test_args'
else
  set_output '.build.args.ci | join(" ")' 'build_args'
  set_output '.test.args.ci | join(" ")' 'test_args'
fi
