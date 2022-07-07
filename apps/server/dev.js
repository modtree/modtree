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
nodemon({
  script: path.resolve(rootDir, 'dist/apps/server/bundle.js'),
  watch: path.resolve(rootDir, 'dist/apps/server'),
})

/**
 * Breakdown for future debugging.
 */
nodemon
  .on('start', function () {
    console.log('App has started')
  })
  .on('quit', function () {
    console.log('App has quit')
    process.exit()
  })
  .on('restart', function (files) {
    console.log('App restarted due to: ', files)
  })
