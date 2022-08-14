const { stat } = require('fs')
const { spawn, spawnSync } = require('child_process')
const { resolve } = require('path')
const compiler = require('./webpack')

// get list of build outputs
const entry = Object.keys(compiler.options.entry)
const files = entry.map((x) => resolve(compiler.outputPath, x + '.js'))

// existence check
const each = files.map((f) => new Promise((r) => stat(f, (e) => r(e === null))))
const all = Promise.all(each).then((r) => r.every(Boolean))

all.then((all) => {
  // if not all build outputs are present, rebuild cy-reporter
  if (!all) {
    spawnSync('node', ['libs/cy-reporter/dev.js', '--build'], {
      stdio: 'inherit',
    })
  }
  // run cy-reporter
  const args = process.argv.slice(2)
  spawn('node', ['dist/libs/cy-reporter/cli.js', ...args], { stdio: 'inherit' })
})
