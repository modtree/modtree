#!/usr/bin/env bash

# Migration step 1/2:
#  -> generate the migration file
#     run the migration file
#
# creates a TypeScript file that contains TypeORM SQL queries
# that upon running, executes a migration.

# npm's TypeORM binary, because ts-node has issues resolving this
TYPEORM=node_modules/.bin/typeorm

# general configs
REPO=libs/migrations
TSCONFIG=$REPO/tsconfig.lib.json

# path to help text
HELP=scripts/migration/generate.help.txt

# target destination of TypeScript file to be created
SNAPSHOTS=$REPO/snapshots

# function that generates the migration file
generate() {
  yarn ts-node --project $TSCONFIG \
    -r tsconfig-paths/register \
    $TYPEORM migration:generate \
    -d $REPO/src/config.ts \
    $SNAPSHOTS/$NAME ${POSITIONAL_ARGS[@]}
}

warn() { printf "\e[1;33m$1\e[1;0m\n"; }
log() { printf "\e[1;36m$1\e[1;0m\n"; }

handle_arguments() {
  while [[ $# -gt 0 ]]; do
    case $1 in
      -n|--name)
        NAME="$2"
        shift # past argument
        shift # past value
        ;;
      --dr|--dryrun)
        POSITIONAL_ARGS+=("--dryrun") # save positional arg
        shift # past value
        ;;
      -*|--*)
        echo "Unknown option $1"
        exit 1
        ;;
      *)
        POSITIONAL_ARGS+=("$1") # save positional arg
        shift # past argument
        ;;
    esac
  done
}

[ -z $1 ] && cat $HELP && exit 0
handle_arguments $@

[ -z $NAME ] \
  && warn "Please provide a migration name." && exit 1 \
  || (printf "Generating migration: " && log $NAME)

read -n 1 -p "Confirm? (Y/n) " yn
log "\n\nGenerating migration..."
([ $yn = 'y' ] || [ $yn = 'Y' ]) && generate
