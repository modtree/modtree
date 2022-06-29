#!/usr/bin/env bash

dropdb modtree
createdb modtree
psql modtree < ../libs/sql/snapshots/mod3.sql
