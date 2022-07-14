import fs from 'fs'
import json from './tests.json'
import { parse } from './parse'
import type { TestAlias, TestGroup, Test } from './types'
import { handleArgs } from './handle-args'

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

const addAlias = useAddAlias(parse.aliases(json.aliases))
const addGroup = useAddGroup(parse.groups(json.groups))

const tests = parse.tests(json.jestProjects).map(addGroup).map(addAlias)

const args = handleArgs(process.argv.slice(2), tests)

const spawnArgs = [
  'yarn',
  'jest',
  ...args.projectPaths,
  ...args.testPathPattern,
  ...args.tail,
]

if (!args.tail.includes('--dr')) {
  fs.writeFileSync('test.command', spawnArgs.join(' '))
}
