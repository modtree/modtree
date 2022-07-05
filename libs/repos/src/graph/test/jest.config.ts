/* eslint-disable */
export default {
  displayName: 'repo:graph',
  preset: '../../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../../coverage/libs/repos/graph',
  maxWorkers: 2,
}
