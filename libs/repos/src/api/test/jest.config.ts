/* eslint-disable */
export default {
  displayName: 'repo:api',
  preset: '../../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../../coverage/libs/repos/api',
  maxWorkers: 2,
}
