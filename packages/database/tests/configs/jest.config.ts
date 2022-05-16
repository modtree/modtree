import type { Config } from '@jest/types'

const base: Config.InitialOptionsWithRootDir = {
  rootDir: '../..',
  // lets console logs show
  silent: true,
  // shows results of each test function within each test file
  verbose: true,
  // stops testing upon one failure
  bail: 1,
  // clear mocks, calls, instances, contexts and results before every test
  clearMocks: true,
  preset: 'ts-jest',
  globalTeardown: './tests/teardown.ts',
  testMatch: ['**/tests/**/*.test.ts'],
  testPathIgnorePatterns: ['setup.ts', 'teardown.ts'],
}

export const ci: Config.InitialOptions = {
  ...base,
  testMatch: ['**/tests/**/*.test.ts'],
  testPathIgnorePatterns: [...base.testPathIgnorePatterns, 'pull'],
}

export const pull: Config.InitialOptions = {
  ...base,
  testMatch: ['**/tests/**/*pull.test.ts'],
}

export const k: Config.InitialOptions = {
  ...base,
  testMatch: ['**/tests/**/module-condensed.test.ts'],
}


export default base
