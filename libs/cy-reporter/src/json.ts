import { main } from './reporter'
import type { Runner } from './types'

console.log('THIS IS THE REPORTER FILE')
class Reporter {
  constructor(runner: Runner) {
    main(runner)
  }
}

module.exports = Reporter
