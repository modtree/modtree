From most raw to closest to production:

- node:16-alpine
- modtree/node
- modtree/yarn
- modtree/server

# node:16-alpine

Pulled from node's official docker registry.

# modtree/node

node:16-alpine + required system apps such as:

- g++
- make

# modtree/yarn

modtree/node + `yarn install`

This exists because `yarn install` takes really long, and
our packages don't change that often anyway.

# modtree/server

modtree/yarn + runnable server

Running this image should spawn a node server with modtree's
api.
