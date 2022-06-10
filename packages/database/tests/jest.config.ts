import { Config } from '@jest/types'

const all: Config.InitialOptionsWithRootDir = {
  rootDir: '..',
  moduleNameMapper: {
    '@repository': '<rootDir>/src/repository',
    '@config': '<rootDir>/src/config',
    '@sql': '<rootDir>/src/sql',
    '@environment': '<rootDir>/tests/environment',
    '@init': '<rootDir>/tests/init',
    '@src/(.*)': '<rootDir>/src/$1',
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

export default all
