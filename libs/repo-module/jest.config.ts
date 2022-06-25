/* eslint-disable */
export default {
  displayName: 'repo-module',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/libs/repo-module',
  testPathIgnorePatterns: ['json-dump'],
  testTimeout: 15000,
  maxWorkers: 3,
  testSequencer: './test/sequencer.js',
}
