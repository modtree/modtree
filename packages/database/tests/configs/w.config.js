const base = require('./jest.config')

module.exports = {
  ...base,
  testMatch: ['**/tests/module-pull.test.ts'],
  silent: false,
}
