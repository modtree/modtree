#!/usr/bin/env bash

PASSWORD=$(cat ./admin.config.json | jq -r .development.password)
USERNAME=$(cat ./admin.config.json | jq -r .development.username)
HOST=$(cat ./admin.config.json | jq -r .development.host)
DATABASE=$(cat ./admin.config.json | jq -r .development.database)

restore() {
  PGPASSWORD=$PASSWORD psql \
    --username=$USERNAME --host=$HOST \
    $DATABASE < ./libs/sql/snapshots/postgres-modules-only.sql
}

drop_all_tables() {
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

# drop_all_tables
# restore

# postgres cli: Delete an entry/row
# delete from "user" where id = '2bcff5a5-b03f-43f1-9a03-609dd252d111';
