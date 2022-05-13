const base = require('./jest.config')

module.exports = {
  ...base,
  testPathIgnorePatterns: [
    ...base.testPathIgnorePatterns,
    'entity','list'
  ],
  silent: true
}
