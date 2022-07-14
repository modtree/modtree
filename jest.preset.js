const path = require('path')
const fs = require('fs')

const tsconfig = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'tsconfig.base.json')).toString()
)
const { baseUrl, paths } = tsconfig.compilerOptions

const resolvedPaths = Object.entries(paths).reduce((acc, [key, value]) => {
  acc[key] = path.resolve(__dirname, baseUrl, value[0])
  return acc
}, {})

module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: resolvedPaths,
  setupFilesAfterEnv: [path.join(__dirname, 'libs/test-env/src/jest.ts')],
  coverageReporters: ['cobertura', 'text', 'lcov'],
  coveragePathIgnorePatterns: ['/repo-pull/'],
  passWithNoTests: true,
}
