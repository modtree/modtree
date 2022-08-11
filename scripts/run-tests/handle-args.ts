import fs from 'fs'
import path from 'path'
import type { Test, TestGroup } from './types'
import chalk from 'chalk'
import { helpText } from './help'

const rootDir = path.resolve(__dirname, '../..')

const jsonFileName =
  new Date().toLocaleString('en-sg').replace(/(\/|:|,| )+/g, '.') + '.json'

type ProcessedArgs = {
  tail: string[]
  projectPaths: string[]
  testPathPattern: string[]
}

function sortByAlias(a: Test, b: Test) {
  if (!a.alias) return 1
  if (!b.alias) return -1
  return a.alias > b.alias ? 1 : -1
}

function zip(k: string[], v: string[]): Record<string, string> {
  return k.reduce((a, k, i) => ({ ...a, [k]: v[i] }), {})
}

export function handleArgs(
  args: string[],
  tests: Test[],
  groups: TestGroup[]
): ProcessedArgs {
  let testPathPattern: string[] = []
  const tail: string[] = []
  const projectNames: string[] = []
  let projectPaths: string[] = []
  let hasError = false
  let markedIndex = -1
  let hit: Test | undefined
  let groupHit: TestGroup | undefined
  const setTestPathPattern = (p: string | undefined) => {
    if (p !== undefined) testPathPattern = ['--testPathPattern', p]
  }

  args.forEach((arg, i) => {
    /** --testPathPattern */
    if (arg === '-m') {
      markedIndex = i + 1
      return
    } else if (markedIndex === i) {
      setTestPathPattern(arg)
      return
    }

    /** --json */
    if (arg === '--json') {
      const jsonDir = path.resolve(rootDir, 'dist/tests')
      /** create directory for json outputs */
      fs.mkdirSync(jsonDir, { recursive: true })
      tail.push('--json', '--outputFile', path.resolve(jsonDir, jsonFileName))
      return
    }

    /** jest bypasses */
    const bypass = ['--verbose', '--coverage', '--runInBand', '--dr']
    if (bypass.includes(arg)) {
      tail.push(arg)
      return
    }

    /** direct test */
    hit = tests.find((t) => t.name === arg)
    if (hit) {
      projectPaths.push(hit.path)
      projectNames.push(hit.name)
      return
    }

    /** aliased test */
    hit = tests.find((t) => t.alias === arg)
    if (hit) {
      projectPaths.push(hit.path)
      projectNames.push(hit.name)
      return
    }

    groupHit = groups.find((g) => g.name === arg)
    /** grouped test */
    if (groupHit) {
      const paths: string[] = groupHit.tests
        .map((name) =>
          tests.filter((test) => test.name === name || test.alias === name)
        )
        .reduce((acc, cur) => [...acc, ...cur], [] as Test[])
        .map((t) => t.path)
      projectPaths.push(...paths)
      projectNames.push(...groupHit.tests)
      tail.push(...(groupHit.args || []))
      setTestPathPattern(groupHit.pattern)
      return
    }

    /** if all conditionals are bypassed, something is wrong */
    hasError = true
  })

  /**
   * args processing reporter
   */
  if (hasError || args.length === 0) {
    // Print help text
    console.debug(helpText)
    // Print workspaces
    console.debug(
      chalk.cyan('Please choose from these tests:'),
      tests
        .sort(sortByAlias)
        .map(({ name, alias }) => (alias ? { name, alias } : { name })),
      '\n'
    )
    // Print groups
    console.debug(
      chalk.cyan('or from these groups:'),
      groups.map((group) => ({ name: group.name, tests: group.tests })),
      '\n'
    )
    process.exit(0)
  } else {
    console.debug({
      projects: zip(projectNames, projectPaths),
      testPathPattern,
      tail,
    })
  }

  /**
   * set the output for handleArgs
   */
  if (projectPaths.length > 0) {
    projectPaths = ['--projects', ...projectPaths]
  }
  const output = { projectPaths, testPathPattern, tail }

  return output
}
