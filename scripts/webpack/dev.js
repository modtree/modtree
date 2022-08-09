const nodemon = require('nodemon')
const { dirname } = require('path')
const { gray, magenta } = require('chalk')
const webpack = require('webpack')
const date = () => new Date().toLocaleString()

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
    this.#script = script
  }

  /**
   * prints webpack compile errors to console
   * @param {webpack.Stats} stats
   */
  #inspect(stats) {
    if (stats.hasErrors()) {
      console.error(stats.toString())
    } else {
      console.log(gray('webpack: build succeeded.'), date())
    }
  }

  /**
   * run the build once and exit
   */
  build() {
    this.#compiler.run((_, stats) => {
      this.#inspect(stats)
      process.exit(stats.hasErrors() ? 1 : 0)
    })
  }

  /**
   * run the build and watch for changes
   */
  watch() {
    this.#compiler.watch({ aggregateTimeout: 300 }, (_, s) => this.#inspect(s))
    nodemon({ script: this.#script, watch: dirname(this.#script) })
    nodemon.on('restart', () => {
      console.log(magenta('nodemon restarted', date()))
    })
  }
}

module.exports = Runner
