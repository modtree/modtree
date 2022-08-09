require('cypress').open({
  browser: 'electron',
  configFile: 'cypress.config.js',
  project: 'apps/web-e2e',
  testingType: 'e2e',
})
