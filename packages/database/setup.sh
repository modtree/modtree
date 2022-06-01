#!/usr/bin/env sh

cp .env.example .env
dropdb modtree 2>/dev/null
createdb modtree 2>/dev/null
yarn restore:default
