/* eslint-disable */
export default {
  displayName: 'repo:module-condensed',
  preset: '../../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../../coverage/libs/repos/module-condensed',
  maxWorkers: 2,
}
