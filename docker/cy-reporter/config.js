const { resolve } = require('path')
const build = require('./build')

const rootDir = resolve(__dirname, '../..')
const tmpDir = resolve(__dirname, 'tmp')
const root = (file) => resolve(rootDir, file)

build({
  rootDir,
  tmpDir,
  herokuProject: 'modtree-cy-reporter',
  build: {
    module: root('libs/cy-reporter/dev.js'),
    args: ['--build'],
    output: root('dist/libs/cy-reporter/server.js'),
  },
  dockerfile: resolve(__dirname, 'Dockerfile'),
})
