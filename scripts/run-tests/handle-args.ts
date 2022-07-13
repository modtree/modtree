import fs from 'fs'
import path from 'path'
import type { StrRec } from './types'
import chalk from 'chalk'

const rootDir = path.resolve(__dirname, '../..')

const jsonOutputFile = new Date()
  .toLocaleString('en-sg')
  .replace(/(\/|:|,| )+/g, '.')

type ProcessedArgs = {
  tail: string[]
  projectPaths: string[]
  testPathPattern: string[]
}

export function handleArgs(
  args: string[],
  tests: StrRec,
  aliases: StrRec
): ProcessedArgs {
  const testPathPattern: string[] = []
  const tail: string[] = []
  const projectNames: string[] = []
  let projectPaths: string[] = []
  let hasError = false
  let markedIndex = -1

  const hasTest = (t: string) => Object.keys(tests).includes(t)
  const hasAlias = (a: string) => Object.keys(aliases).includes(a)

  args.forEach((arg, i) => {
    /** --testPathPattern */
    if (arg === '-m') {
      markedIndex = i + 1
      return
    } else if (markedIndex === i) {
      testPathPattern.push('--testPathPattern', arg)
      return
    }

    /** --json */
    if (arg === '--json') {
      const jsonDir = path.resolve(rootDir, 'dist/tests')
      /** create directory for json outputs */
      fs.mkdirSync(jsonDir, { recursive: true })
      tail.push('--json', '--outputFile', path.resolve(jsonDir, jsonOutputFile))
      return
    }

    /** --verbose */
    if (arg === '--verbose') {
      tail.push('--verbose')
      return
    }

    /** direct test */
    if (hasTest(arg)) {
      projectPaths.push(tests[arg])
      projectNames.push(arg)
      return
    }

    /** aliased test */
    if (hasAlias(arg) && hasTest(aliases[arg])) {
      projectPaths.push(tests[aliases[arg]])
      projectNames.push(aliases[arg])
      return
    }

    /** if all conditionals are bypassed, something is wrong */
    hasError = true
  })

  /**
   * args processing reporter
   */
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

  if (projectPaths.length > 0) {
    projectPaths = ['--projects', ...projectPaths]
  }

  return { tail, projectPaths, testPathPattern }
}