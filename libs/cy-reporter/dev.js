/**
 * Starts a process that watches dist/apps/server for updates.
 */
const compiler = require('./webpack')
const path = require('path')

/**
 * Starts a webpack daemon that recompiles the server bundle everytime there's
 * a change in a dependency.
 */
compiler.watch({ aggregateTimeout: 300 }, (_err, stats) => {
  if (stats.hasErrors()) {
    console.log(stats.toString())
  }
  console.log('rebuild cy-reporter', new Date().toLocaleString())
})
