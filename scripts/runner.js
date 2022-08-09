const nodemon = require('nodemon')
const webpack = require('webpack')
const { resolve } = require('path')
const { gray, magenta } = require('chalk')
const date = () => new Date().toLocaleString()

/**
 * prints webpack compile errors to console
 * @param {webpack.Stats} stats
 */
function showErrors(stats) {
  if (stats.hasErrors()) {
    console.error(stats.toString())
  } else {
    console.log(gray('webpack: build succeeded.'), date())
  }
}

class Runner {
  // private fields
  #compiler
  #script

  /**
   * instantiates a Runner
   * @param {webpack.Compiler} compiler
   * @param {string} script
   */
  constructor(compiler, script) {
    this.#compiler = compiler
    this.#script = resolve(compiler.outputPath, script)
  }

  /**
   * run the build once and exit
   */
  build() {
    this.#compiler.run((_, stats) => {
      showErrors(stats)
      process.exit(stats.hasErrors() ? 1 : 0)
    })
  }

  /**
   * run the build and watch for changes
   */
  watch() {
    this.#compiler.watch({ aggregateTimeout: 300 }, (_, s) => showErrors(s))
    nodemon({ script: this.#script, watch: this.#compiler.outputPath })
    nodemon
      .on('quit', () => process.exit())
      .on('restart', () => {
        console.log(magenta('nodemon restarted', date()))
      })
  }

  /**
   * runs a method based on arguments supplied
   */
  run() {
    const hasArg = (a) => process.argv.slice(2).includes(a)
    if (hasArg('--build')) {
      this.build()
    } else if (hasArg('--watch')) {
      this.watch()
    }
  }
}

module.exports = Runner
