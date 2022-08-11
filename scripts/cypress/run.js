const { basename } = require('path')
const { gray } = require('chalk')

/**
 * honestly no idea why but this particular file cannot be written in TypeScript
 * then compiled with webpack to js.
 */

// this is the offending line.
const cypress = require('cypress')
// somehow
//
//  1. `import * as cypress from 'cypress'`
//  2. `import cypress from 'cypress'`
//  3. `import { run } from 'cypress'`
//
// all don't work

const cypressConfig = {
  project: 'apps/web-e2e', // relative to process.cwd()
  configFile: 'cypress.config.js', // relative to project
  quiet: true,
}

/**
 * read the one and only argument,
 * which will be the spec file to run
 */
const args = process.argv.slice(2)
const thisScript = basename(__dirname) + '/' + basename(__filename)
if (args.length !== 1) {
  console.debug('Please provide exactly one argument to', thisScript, '\n')
  process.exit(1)
} else if (args[0] !== '--all') {
  // if that one argument is --all, don't specify a spec file
  // else, add that to the config
  Object.assign(cypressConfig, { spec: args[0] })
}

/**
 * run cypress
 * note that this somehow owns all of cypress's forks,
 * which is awesome. This means that this script will
 * only close when cypress + sender closes.
 */
cypress.run(cypressConfig).then(() => {
  console.log('Cypress runs have completed.')
})

process.on('exit', () => {
  console.log(gray(thisScript, 'has left the building.'))
})
