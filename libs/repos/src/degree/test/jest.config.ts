/* eslint-disable */
export default {
  displayName: 'repo:degree',
  preset: '../../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../../coverage/libs/repos/degree',
  maxWorkers: 2,
}
