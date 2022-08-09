const Runner = require('../../scripts/runner')
const compiler = require('./webpack')

const runner = new Runner(compiler, 'server.js')
runner.run()
