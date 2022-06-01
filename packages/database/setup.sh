#!/usr/bin/env sh

cp .env.example .env
createdb modtree 2>/dev/null
yarn restore:default
