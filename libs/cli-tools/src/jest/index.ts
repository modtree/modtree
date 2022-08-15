import { readFileSync } from 'fs'
import { opts } from './parser'
import { testJson } from './paths'
import { getTestsJson } from './utils'

export type StrRec = Record<string, string>
export type ArrRec = Record<string, string[]>

type TestGroup = {
  name: string
  tests: string[]
  pattern?: string
  args?: string[]
}

type TestAlias = {
  alias: string
  target: string
}

type Test = {
  name: string
  path: string
  groups: string[]
  alias?: string
}

const testsJson = getTestsJson()

console.log(testsJson)

const useAddGroup =
  (groups: TestGroup[]) =>
  (test: Test): Test => ({
    ...test,
    groups: groups
      .filter((group) => group.tests.includes(test.name))
      .map((group) => group.name),
  })

const useAddAlias =
  (aliases: TestAlias[]) =>
  (test: Test): Test => {
    const alias = aliases.find((e) => e.target === test.name)?.alias
    return alias ? { ...test, alias } : test
  }

// const groups = parse.groups(json.groups)
// const addAlias = useAddAlias(parse.aliases(json.aliases))
// const addGroup = useAddGroup(groups)
// const tests = parse.tests(json.jestProjects).map(addGroup).map(addAlias)
// const args = handleArgs(process.argv.slice(2), tests, groups)

// const spawnArgs = [
//   'yarn',
//   'jest',
//   ...args.projectPaths,
//   ...args.testPathPattern,
//   ...args.tail,
// ]

// if (!args.tail.includes('--dr')) {
//   fs.writeFileSync('test.command', spawnArgs.join(' '))
// }
