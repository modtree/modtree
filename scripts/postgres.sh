#!/usr/bin/env bash

TARGET=development

PASSWORD=$(cat ./admin.config.json | jq -r .${TARGET}.password)
USERNAME=$(cat ./admin.config.json | jq -r .${TARGET}.username)
HOST=$(cat ./admin.config.json | jq -r .${TARGET}.host)
DATABASE=$(cat ./admin.config.json | jq -r .${TARGET}.database)

remote_restore() {
  PGPASSWORD=$PASSWORD psql --username=$USERNAME --host=$HOST \
    $DATABASE < ./libs/sql/snapshots/postgres-modules-only.sql
}

local_restore() {
  psql $DATABASE < ./libs/sql/snapshots/postgres-modules-only.sql
}

remote_drop_all_tables() {
PGPASSWORD=$PASSWORD psql --username=$USERNAME --host=$HOST $DATABASE << EOF
drop table if exists "graph_modules_hidden_module";
drop table if exists "graph_modules_placed_module";
drop table if exists "user_modules_doing_module";
drop table if exists "user_modules_done_module";
drop table if exists "user_saved_degrees_degree";
drop table if exists "user_saved_graphs_graph";
drop table if exists "degree_modules_module";
drop table if exists "graph";
drop table if exists "user";
drop table if exists "degree";
drop table if exists "module";
drop table if exists "moduleCondensed";
drop table if exists "typeorm_metadata";
EOF
}

local_drop_all_tables() {
psql $DATABASE << EOF
drop table if exists "graph_modules_hidden_module";
drop table if exists "graph_modules_placed_module";
drop table if exists "user_modules_doing_module";
drop table if exists "user_modules_done_module";
drop table if exists "user_saved_degrees_degree";
drop table if exists "user_saved_graphs_graph";
drop table if exists "degree_modules_module";
drop table if exists "graph" CASCADE;
drop table if exists "user" CASCADE;
drop table if exists "degree" CASCADE;
EOF
}

main() {
  local_drop_all_tables
  # local_restore
}

main

# postgres cli: Delete an entry/row
# delete from "user" where id = '2bcff5a5-b03f-43f1-9a03-609dd252d111';
