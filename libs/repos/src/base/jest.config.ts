/* eslint-disable */
export default {
  displayName: 'repo:base',
  preset: '../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../coverage/libs/repos/utils',
  maxWorkers: 2,
}
