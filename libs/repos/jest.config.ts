/* eslint-disable */
export default {
  preset: '../../jest.preset.js',
  projects: [
    '<rootDir>/src/user/test',
    '<rootDir>/src/degree/test',
    '<rootDir>/src/graph/test',
    '<rootDir>/src/module/test',
    '<rootDir>/src/module-condensed/test',
  ],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/libs/repos',
}
