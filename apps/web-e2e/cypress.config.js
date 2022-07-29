const { defineConfig } = require('cypress')

const config = defineConfig({
  fileServerFolder: '.',
  fixturesFolder: './cypress/fixtures',
  reporter: 'reporters/json.js',
  modifyObstructiveCode: false,
  video: false,
  videosFolder: '../../dist/cypress/apps/web-e2e/videos',
  screenshotsFolder: '../../dist/cypress/apps/web-e2e/screenshots',
  chromeWebSecurity: false,
  e2e: {
    specPattern: './cypress/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: './cypress/support/index.ts',
    baseUrl: 'http://localhost:3000',
  },
})

module.exports = config
