const base = require('./jest.config')

module.exports = {
  ...base,
  testMatch: ['**/tests/**/fetch?(.*).ts'], // anything that is under any tests dir
}
