const base = require('./jest.config')

module.exports = {
  ...base,
  testMatch: ['**/tests/**/*scripts?(.*).ts'], // anything that is under any tests dir
  testPathIgnorePatterns: [
    ...base.testPathIgnorePatterns,
    "all-scripts"
  ],
  silent: false
}
