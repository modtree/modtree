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
  compiler.run((_, stats) => {
    showErrors(stats)
    process.exit(stats.hasErrors() ? 1 : 0)
  })
}
