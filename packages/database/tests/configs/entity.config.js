const base = require('./jest.config')

module.exports = {
  ...base,
  testMatch: ['**/tests/entity/*.test.ts'],
  silent: false,
}
