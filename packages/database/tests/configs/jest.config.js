module.exports = {
  rootDir: '../..',
  silent: true,
  clearMocks: true,
  preset: 'ts-jest',
  globalTeardown: './tests/teardown.ts',
  testMatch: ['**/tests/**/*.test.ts'], // anything that is under any tests dir
  testPathIgnorePatterns: ['setup.ts', 'teardown.ts', 'config.js', '.ignore', 'index.test.ts'],
}
