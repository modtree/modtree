/* eslint-disable */
export default {
  displayName: 'repo:user',
  preset: '../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../../coverage/libs/repos/user',
  maxWorkers: 2,
}
