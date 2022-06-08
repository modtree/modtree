import { Config } from '@jest/types'

const all: Config.InitialOptionsWithRootDir = {
  rootDir: '..',
  moduleNameMapper: {
    '@entity': '<rootDir>/src/entity',
    '@repository': '<rootDir>/src/repository',
    '@utils': '<rootDir>/src/utils',
    '@config': '<rootDir>/src/config',
    '@sql': '<rootDir>/src/sql',
    '@environment': '<rootDir>/tests/environment',
    '@init': '<rootDir>/tests/init',
    '@src/(.*)': '<rootDir>/src/$1',
    '@mtypes/(.*)': '<rootDir>/types/$1',
    '@tests/(.*)': '<rootDir>/tests/$1',
  },
  // show console logs
  silent: true,
  // shows results of each test function within each test file
  verbose: true,
  // stops testing upon one failure
  bail: 1,
  // clear mocks, calls, instances, contexts and results before every test
  clearMocks: true,
  // actual stuff
  preset: 'ts-jest',
}

const wTest = 'utils'
export const w: Config.InitialOptions = {
  ...all,
  testMatch: [`**/tests/**/${wTest}.test.ts`],
  silent: false,
}

export default all
