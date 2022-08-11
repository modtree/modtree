const { join, resolve } = require('path')
const { readFileSync } = require('fs')

// locating tsconfig.json
const dir = __dirname
const file = 'tsconfig.base.json'

/** @type { import('typescript').CompilerOptions} */
const { baseUrl, paths } = JSON.parse(
  readFileSync(resolve(dir, file), 'utf8')
).compilerOptions

/** @type { import('typescript').MapLike<string[]> */
const resolvedPaths = Object.entries(paths).reduce(
  (a, [k, v]) => ({ ...a, [k]: resolve(dir, baseUrl, v[0]) }),
  {}
)

/** @type { import('@jest/types').Config.InitialOptions } */
module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: resolvedPaths,
  setupFilesAfterEnv: [join(__dirname, 'libs/test-env/src/jest.ts')],
  coverageReporters: ['cobertura', 'text', 'lcov'],
  coveragePathIgnorePatterns: ['/repo-pull/'],
  passWithNoTests: true,
}
