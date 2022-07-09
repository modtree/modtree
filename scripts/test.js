const fs = require('fs')
const path = require('path')
const args = process.argv.slice(2)
const getAllFiles = require('./get-all-files')
const chalk = require('chalk')
const { spawn } = require('child_process')

const rootDir = path.resolve(__dirname, '..')
const ignore = ['node_modules', 'dist']

/**
 * @param {string[]} arr - array of filepaths
 * @returns {{names: string[][], record: Record<string, string>}} array of pairs: test name and test path
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
const testPathPattern = []
const projectPathsToTest = []

let testPathPatternIndex = -1
let allOk = true
args.map((arg, i) => {
  if (arg === '-m') {
    /** mark the next one to use as test path pattern */
    testPathPatternIndex = i + i
    return
  }
  if (testPathPatternIndex === i) {
    console.log('--', arg)
    testPathPattern.push('--testPathPattern', arg)
    return
  }
  if (tests.names.includes(arg)) {
    projectPathsToTest.push(tests.record[arg])
    projectsToTest.push(arg)
    return
  }
  const repoPrefix = `repo:${arg}`
  if (tests.names.includes(repoPrefix)) {
    projectPathsToTest.push(tests.record[repoPrefix])
    projectsToTest.push(repoPrefix)
    return
  }
  allOk = false
})
if (!allOk || args.length === 0) {
  console.debug(
    chalk.cyan('\nPlease choose from these tests:'),
    tests.names,
    '\n'
  )
  process.exit(0)
} else {
  console.debug(chalk.cyan('\nTests chosen:'), projectsToTest)
  console.debug(chalk.cyan('Test path pattern:'), testPathPattern[1], '\n')
}

const jsonOutputFile = new Date()
  .toLocaleString('en-sg')
  .replace(/(\/|:|,| )+/g, '.')

const spawnArgs = [
  'jest',
  '--color',
  '--json',
  '--outputFile',
  path.resolve(rootDir, 'dist/tests', `${jsonOutputFile}.json`),
  '--projects',
  ...projectPathsToTest,
  ...testPathPattern,
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
