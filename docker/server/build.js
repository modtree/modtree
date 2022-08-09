const { resolve } = require('path')
const build = require('../build')
const root = (f) => resolve(__dirname, '../..', f)

build({
  tmpDir: resolve(__dirname, 'tmp'),
  herokuProject: 'modtree',
  build: {
    module: root('apps/server/dev.js'),
    args: ['--build'],
    output: root('dist/apps/server/bundle.js'),
  },
  dockerfile: resolve(__dirname, 'Dockerfile'),
})
