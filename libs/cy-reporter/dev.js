const nodemon = require('nodemon')
const { resolve } = require('path')
const Runner = require('../../scripts/webpack/dev')
const compiler = require('./webpack')

const runner = new Runner(compiler, resolve(compiler.outputPath, 'server.js'))

const hasArg = (a) => process.argv.slice(2).includes(a)
if (hasArg('--build')) {
  runner.build()
} else if (hasArg('--watch')) {
  runner.watch()
}
