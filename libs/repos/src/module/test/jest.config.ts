/* eslint-disable */
export default {
  displayName: 'module',
  preset: '../../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../../coverage/libs/repos/module',
  maxWorkers: 2,
}
