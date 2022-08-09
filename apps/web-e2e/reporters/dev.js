const cypress = require('cypress')

const cypressConfig = {
  project: 'apps/web-e2e', // relative to process.cwd()
  configFile: 'cypress.config.js', // relative to project
  quiet: true,
  detached: true,
}

/**
 * run cypress
 */
cypress.run(cypressConfig).then(() => {
  console.log('Cypress runs have completed.')
})
