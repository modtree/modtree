const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fileServerFolder: '.',
  fixturesFolder: './cypress/fixtures',
  modifyObstructiveCode: false,
  video: false,
  videosFolder: '../../dist/cypress/apps/web-e2e/videos',
  screenshotsFolder: '../../dist/cypress/apps/web-e2e/screenshots',
  chromeWebSecurity: false,
  e2e: {
    // setupNodeEvents(on, config) {},
    specPattern: './cypress/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: './cypress/support/index.ts',
  },
})
