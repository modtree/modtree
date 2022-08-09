const { resolve } = require('path')
const build = require('../build')
const root = (f) => resolve(__dirname, '../..', f)

build({
  tmpDir: resolve(__dirname, 'tmp'),
  herokuProject: 'modtree-cy-reporter',
  build: {
    module: root('libs/cy-reporter/dev.js'),
    args: ['--build'],
    output: root('dist/libs/cy-reporter/server.js'),
  },
  dockerfile: resolve(__dirname, 'Dockerfile'),
})
