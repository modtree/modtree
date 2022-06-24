const nxPreset = require('@nrwl/jest/preset').default
const join = require('path').join

module.exports = {
  ...nxPreset,
  setupFilesAfterEnv: [join(__dirname, 'libs/test-env/src/jest.ts')],
  coverageReporters: ['cobertura', 'text'],
}
