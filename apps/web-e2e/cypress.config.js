const { defineConfig } = require('cypress')
const { GoogleSocialLogin } = require('cypress-social-logins').plugins

module.exports = defineConfig({
  fileServerFolder: '.',
  fixturesFolder: './cypress/fixtures',
  modifyObstructiveCode: false,
  video: false,
  videosFolder: '../../dist/cypress/apps/web-e2e/videos',
  screenshotsFolder: '../../dist/cypress/apps/web-e2e/screenshots',
  chromeWebSecurity: false,
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        GoogleSocialLogin: GoogleSocialLogin,
      })
    },
    specPattern: './cypress/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: './cypress/support/index.ts',
    baseUrl: 'http://localhost:3000',
  },
})
