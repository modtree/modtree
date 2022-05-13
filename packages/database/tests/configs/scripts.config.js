const base = require('./jest.config')

module.exports = {
  ...base,
  testMatch: ['**/tests/package-json-scripts/**/*.test.ts'], // anything that is under any tests dir
  silent: false
}
