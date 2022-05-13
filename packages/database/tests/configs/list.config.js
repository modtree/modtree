const base = require('./jest.config')

module.exports = {
  ...base,
  testMatch: ['**/tests/**/*list?(.*).test.ts'], // anything that is under any tests dir
  silent: false
}
