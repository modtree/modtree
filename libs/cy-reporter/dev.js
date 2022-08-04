const nodemon = require('nodemon')
const { resolve } = require('path')
const { gray } = require('chalk')
const compiler = require('./webpack')

/**
 * runs
 */
const args = process.argv.slice(2)
const showErrors = (s) => {
  if (s.hasErrors()) {
    console.log(s.toString())
  } else {
    console.log(gray('webpack: build succeeded.'), new Date().toLocaleString())
  }
}

/**
 * run the build once
 */
if (args.includes('--build')) {
  compiler.run((_, stats) => showErrors(stats))
}

/**
 * run the build and watch for changes
 */
if (args.includes('--watch')) {
  compiler.watch({ aggregateTimeout: 300 }, (_, stats) => showErrors(stats))

  // start a node server running the cy-reporter proxy
  nodemon({
    script: resolve(compiler.outputPath, 'server.js'),
    watch: resolve(compiler.outputPath),
  })

  // Breakdown for future debugging.
  nodemon
    .on('quit', () => process.exit())
    .on('restart', (files) => {
      console.log('nodemon/cy-reporter refreshed due to: ', files)
    })
}
