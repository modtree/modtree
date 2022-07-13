import { spawn } from 'child_process'
import chalk from 'chalk'
import rawTests from './tests.json'
import { getAliases } from './get-aliases'
import { handleArgs } from './handle-args'

const tests = rawTests as Record<string, string>
const aliases = getAliases(tests, {
  int: 'integration-tests',
  mf: 'repo:module-full',
  mc: 'repo:module-condensed',
})
const args = process.argv.slice(2)
const argsRes = handleArgs(args, tests, aliases)
const { tail, projectNames, projectPaths, hasError, testPathPattern } = argsRes

if (hasError || args.length === 0) {
  console.debug(
    chalk.cyan('\nPlease choose from these tests:'),
    Object.keys(tests),
    chalk.cyan('\nor use one of these aliases:'),
    aliases,
    '\n'
  )
  process.exit(0)
} else {
  console.debug(chalk.cyan('\nTests chosen:'), projectNames)
  console.debug(chalk.cyan('Test path pattern:'), testPathPattern[1], '\n')
}

const spawnArgs = [
  'jest',
  '--color',
  '--projects',
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
