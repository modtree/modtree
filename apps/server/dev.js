/**
 * Starts a process that watches dist/apps/server for updates.
 *
 * Only works then ./webpack is ran with the --watch flag.
 */

require('./webpack')
const nodemon = require('nodemon')
const path = require('path')

const rootDir = path.resolve(__dirname, '../..')

nodemon({
  script: path.resolve(rootDir, 'dist/apps/server/bundle.js'),
  watch: path.resolve(rootDir, 'dist/apps/server'),
})

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
