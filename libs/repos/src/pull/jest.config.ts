/* eslint-disable */
export default {
  displayName: 'repo:pull',
  preset: '../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../../coverage/libs/repos/pull',
  maxWorkers: 2,
}
