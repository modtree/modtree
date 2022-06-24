/* eslint-disable */
export default {
  displayName: 'repo-pull',
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
  coverageDirectory: '../../coverage/libs/repo-pull',
  testPathIgnorePatterns: ['./test/pull/*'],
  testTimeout: 15000,
}
