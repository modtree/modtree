const base = require('./jest.config')

// ignore fetch to reduce strain on NUSMods API
module.exports = {
  ...base,
  testPathIgnorePatterns: [...base.testPathIgnorePatterns, 'fetch'],
}
