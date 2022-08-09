const { resolve } = require('path')
const build = require('../build')
const root = (f) => resolve(__dirname, '../..', f)
const hasArg = (a) => process.argv.slice(2).includes(a)

const herokuProject = hasArg('--prod') ? 'modtree' : 'modtree-dev'

build({
  tmpDir: resolve(__dirname, 'tmp'),
  herokuProject,
  build: {
    module: root('apps/server/dev.js'),
    args: ['--build'],
    output: root('dist/apps/server/bundle.js'),
  },
  dockerfile: resolve(__dirname, 'Dockerfile'),
})
