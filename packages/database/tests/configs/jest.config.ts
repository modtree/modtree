import type { Config } from '@jest/types'

export const all: Config.InitialOptionsWithRootDir = {
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
  ...all,
  testMatch: ['**/tests/**/*.test.ts'],
  testPathIgnorePatterns: [...all.testPathIgnorePatterns, 'module-pull'],
}

export const pull: Config.InitialOptions = {
  ...all,
  testMatch: ['**/tests/**/*pull.test.ts'],
}

const khang = ['dag']
export const k: Config.InitialOptions = {
  ...all,
  testMatch: khang.map((x) => `**/tests/**/${x}.test.ts`),
  silent: false,
}

const wTest = 'utils'
export const w: Config.InitialOptions = {
  ...all,
  testMatch: [`**/tests/**/${wTest}.test.ts`],
  silent: false,
}

export default all
