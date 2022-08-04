#!/usr/bin/env sh

# $1 is the password to heroku's container registry
# $2 is the image to push to the registry


heroku container:push web --context-path ../../
