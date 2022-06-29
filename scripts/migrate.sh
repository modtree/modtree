#!/usr/bin/env bash

dropdb modtree
createdb modtree
psql modtree < ../libs/sql/snapshots/postgres-modules-only.sql
