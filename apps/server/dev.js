const Runner = require('../../scripts/runner')
const compiler = require('./webpack')

const runner = new Runner(compiler, 'bundle.js')
runner.run()
