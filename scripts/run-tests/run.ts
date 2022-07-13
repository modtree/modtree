import { spawn } from 'child_process'
import rawTests from './tests.json'
import { getAliases } from './get-aliases'
import { handleArgs } from './handle-args'

const tests = rawTests as Record<string, string>
const aliases = getAliases(tests, {
  int: 'integration-tests',
  mf: 'repo:module-full',
  mc: 'repo:module-condensed',
})
const argsRes = handleArgs(process.argv.slice(2), tests, aliases)
const { tail, projectPaths, testPathPattern } = argsRes

const spawnArgs = [
  'jest',
  '--color',
  ...projectPaths,
  ...testPathPattern,
  ...tail,
]

const run = true

if (run) {
  const jest = spawn('yarn', spawnArgs)
  jest.stdout.on('data', (d) => process.stdout.write(d))
  jest.stderr.on('data', (d) => process.stderr.write(d))
}
