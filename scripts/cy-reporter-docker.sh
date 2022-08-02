#!/usr/bin/env bash

docker tag modtree/cy-reporter:latest registry.heroku.com/modtree-cy-registry/web
docker push registry.heroku.com/modtree-cy-registry/web

heroku container:release web
