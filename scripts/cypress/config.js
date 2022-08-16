require('dotenv/config')

const baseConfig = {
  project: 'apps/web-e2e',
  configFile: 'cypress.config.js',
  quiet: true,
  record: true,
  key: process.env['CYPRESS_RECORD_KEY'],
}

const run = {}

const open = {
  browser: 'electron',
  testingType: 'e2e',
}

module.exports = {
  baseConfig,
  runConfig: { ...baseConfig, ...run },
  openConfig: { ...baseConfig, ...open },
}
