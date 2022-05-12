const base = require('./jest.config')

module.exports = {
  ...base,
  testMatch: ['**/tests/**/all-scripts?(.*).ts'], // anything that is under any tests dir
  silent: false,
}
