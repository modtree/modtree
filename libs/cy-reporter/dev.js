/**
 * Starts a process that watches dist/apps/server for updates.
 */
const compiler = require('./webpack')
const nodemon = require('nodemon')
const path = require('path')
const rootDir = path.resolve(__dirname, '../..')

/**
 * Starts a webpack daemon that recompiles the server bundle everytime there's
 * a change in a dependency.
 */
compiler.watch({ aggregateTimeout: 300 }, (_err, stats) => {
  if (stats.hasErrors()) {
    console.log(stats.toString())
  }
})

/**
 * Calling nodemon immediately runs a listening node on the .script specified,
 * while watching the .watch directory for changes.
 */
const outDir = 'apps/web-e2e/reporters'
nodemon({
  script: path.resolve(rootDir, outDir, 'json.js'),
  watch: path.resolve(rootDir, outDir),
})

/**
 * Breakdown for future debugging.
 */
nodemon
  .on('start', function () {
    console.log('CyReporter has started')
  })
  .on('quit', function () {
    console.log('CyReporter has quit')
    process.exit()
  })
  .on('restart', function (files) {
    console.log('CyReporter restarted due to: ', files)
  })
