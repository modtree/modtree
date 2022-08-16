const { resolve } = require('path')
const build = require('../build')
const root = (f) => resolve(__dirname, '../..', f)

build({
  tmpDir: resolve(__dirname, 'tmp'),
  herokuProject: 'modtree-cy-reporter',
  build: {
    module: root('libs/cli-tools/dev.js'),
    args: ['--build'],
    output: root('dist/libs/cli-tools/cypress:server.js'),
  },
  dockerfile: resolve(__dirname, 'Dockerfile'),
})
