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
  testMatch: ['**/tests/**/*.test.ts'],
  testPathIgnorePatterns: ['environment.ts'],
  testSequencer: './tests/configs/sequencer.js',
}

export const ci: Config.InitialOptions = {
  ...base,
  testMatch: ['**/tests/**/*.test.ts'],
  testPathIgnorePatterns: [...base.testPathIgnorePatterns, 'module-pull'],
}

export const pull: Config.InitialOptions = {
  ...base,
  testMatch: ['**/tests/**/*pull.test.ts'],
}

const khang = ['dag']
export const k: Config.InitialOptions = {
  ...base,
  testMatch: khang.map((x) => `**/tests/**/${x}.test.ts`),
  silent: false,
}

export const w: Config.InitialOptions = {
  ...base,
  testMatch: ['**/tests/**/dag.test.ts'],
  silent: false,
}

export default base
