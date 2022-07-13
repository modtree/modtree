import fs from 'fs'
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

const spawnArgs = ['yarn', 'jest', ...projectPaths, ...testPathPattern, ...tail]

fs.writeFileSync('test.command', spawnArgs.join(' '))
