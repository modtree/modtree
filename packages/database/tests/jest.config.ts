import { Config } from '@jest/types'

const all: Config.InitialOptionsWithRootDir = {
  rootDir: '..',
  moduleNameMapper: {
    '@modtree/test-env': '<rootDir>/../test-env/dist',
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
  testPathIgnorePatterns: ['pull']
}

export default all
