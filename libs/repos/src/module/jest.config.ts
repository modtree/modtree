import path from 'path'

/* eslint-disable */
export default {
  displayName: 'repo:module',
  preset: '../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../coverage/libs/repos/module',
}
