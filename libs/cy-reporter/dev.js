const Runner = require('../../scripts/runner')
const compiler = require('./webpack')
const hasArg = (a) => process.argv.slice(2).includes(a)

const file = (() => {
  if (hasArg('--server')) return 'server.js'
  if (hasArg('--cli')) return 'cli.js'
  return ''
})()

const runner = new Runner(compiler, file)
runner.run()
