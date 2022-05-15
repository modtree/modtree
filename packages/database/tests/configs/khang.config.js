const base = require('./jest.config')

module.exports = {
  ...base,
  // testMatch: ['**/tests/**/*.test.ts'], // anything that is under any tests dir
  testMatch: ['**/tests/repo.test.ts'], // anything that is under any tests dir
  testPathIgnorePatterns: [
    ...base.testPathIgnorePatterns,
    'module-pull'
  ],
  silent: false,
}
