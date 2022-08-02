#!/usr/bin/env bash

docker tag modtree/cy-reporter:latest registry.heroku.com/modtree-cy-reporter/web
docker push registry.heroku.com/modtree-cy-reporter/web

heroku container:release web -a modtree-cy-reporter
