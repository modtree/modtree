/* eslint-disable */
export default {
  displayName: 'repo:module-full',
  preset: '../../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../../coverage/libs/repos/module-full',
  maxWorkers: 2,
}
