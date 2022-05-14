const base = require('./jest.config')

module.exports = {
  ...base,
  // testMatch: ['**/tests/**/*.test.ts'], // anything that is under any tests dir
  testMatch: ['**/tests/module.test.ts'], // anything that is under any tests dir
  silent: true,
}
