const fs = require('fs')
const path = require('path')
const args = process.argv.slice(2)
const getAllFiles = require('./get-all-files')
const chalk = require('chalk')
const { spawn } = require('child_process')

const rootDir = path.resolve(__dirname, '..')
const ignore = ['node_modules', 'dist']

const jsonOutputFile = new Date()
  .toLocaleString('en-sg')
  .replace(/(\/|:|,| )+/g, '.')

/**
 * @param {string[]} arr - array of filepaths
 * @returns {{names: string[], record: Record<string, string>}} array of pairs: test name and test path
 */
const getTests = (arr = []) => {
  const names = []
  const record = {}
  arr.forEach((f) => {
    const contents = fs.readFileSync(f, 'utf8').toString()
    const re = contents.match(/displayName: ?["'](.*)["'],/)
    if (re) {
      const displayName = re[1]
      names.push(displayName)
      record[displayName] = f
    }
  })
  return { names, record }
}

/**
 * write to test-list.txt the test names and their filepaths
 */
const allFiles = getAllFiles(rootDir, ignore)
const allProjects = allFiles.filter((f) => f.match(/jest.config.[jt]s$/))
const tests = getTests(allProjects)

/**
 * handle arguments
 */
const projectsToTest = []
const postArgs = []
const projectPathsToTest = []

const aliases = {
  int: 'integration-tests',
  mf: 'repo:module-full',
  mc: 'repo:module-condensed',
}
/**
 * auto-create aliases for repo:*
 */
tests.names.forEach((name) => {
  if (name.includes('-')) return
  const re = name.match(/^repo:(.*)$/)
  if (re) aliases[re[1]] = name
})

let markedIndex = -1
let allOk = true
args.map((arg, i) => {
  /**
   * --testPathPattern
   */
  if (arg === '-m') {
    markedIndex = i + 1
    return
  } else if (markedIndex === i) {
    postArgs.push('--testPathPattern', arg)
    return
  }
  /**
   * --json
   */
  if (arg === '--json') {
    postArgs.push('--json', '--outputFile', jsonOutputFile)
    return
  }
  if (tests.names.includes(arg)) {
    projectPathsToTest.push(tests.record[arg])
    projectsToTest.push(arg)
    return
  }
  if (
    Object.keys(aliases).includes(arg) &&
    tests.names.includes(aliases[arg])
  ) {
    projectPathsToTest.push(tests.record[aliases[arg]])
    projectsToTest.push(aliases[arg])
    return
  }
  allOk = false
})
if (!allOk || args.length === 0) {
  console.debug(
    chalk.cyan('\nPlease choose from these tests:'),
    tests.names,
    chalk.cyan('\nor use one of these aliases:'),
    aliases,
    '\n'
  )
  process.exit(0)
} else {
  console.debug(chalk.cyan('\nTests chosen:'), projectsToTest)
  console.debug(chalk.cyan('Test path pattern:'), postArgs[1], '\n')
}

const spawnArgs = [
  'jest',
  '--color',
  '--projects',
  ...projectPathsToTest,
  ...postArgs,
]

const run = true

if (run) {
  /** create directory for json outputs */
  fs.mkdirSync(path.resolve(rootDir, 'dist/tests'), { recursive: true })
  const jest = spawn('yarn', spawnArgs)
  jest.stdout.on('data', (d) => process.stdout.write(d))
  jest.stderr.on('data', (d) => process.stderr.write(d))
}
// jest.on('close', (c) => console.log(`runner exited with code ${c}`))
