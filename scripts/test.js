const fs = require('fs')
const path = require('path')
const getAllFiles = require('./get-all-files')
const args = process.argv.slice(2)
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
const allValid = args.every((a) => tests.names.includes(a))
if (!allValid || args.length === 0) {
  console.debug(
    chalk.cyan('\nPlease choose from these tests:'),
    tests.names,
    '\n'
  )
  process.exit(0)
} else {
  console.debug(chalk.cyan('\nTests chosen:'), args, '\n')
}

const jest = (args) =>
  spawn('yarn', [
    'jest',
    '--color',
    '--projects',
    ...args.map((a) => tests.record[a]),
  ])

const runner = jest(args)

runner.stdout.on('data', (d) => process.stdout.write(d))
runner.stderr.on('data', (d) => process.stderr.write(d))
// runner.on('close', (c) => console.log(`runner exited with code ${c}`))
