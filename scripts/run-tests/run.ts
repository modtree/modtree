import fs from 'fs'
import { parse } from './parse'
import { resolve } from 'path'
import type { TestAlias, TestGroup, Test } from './types'
import { handleArgs } from './handle-args'

const json = JSON.parse(
  fs.readFileSync(resolve(__dirname, '../..', 'tests.json'), 'utf8')
)

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

const groups = parse.groups(json.groups)
const addAlias = useAddAlias(parse.aliases(json.aliases))
const addGroup = useAddGroup(groups)
const tests = parse.tests(json.jestProjects).map(addGroup).map(addAlias)
const args = handleArgs(process.argv.slice(2), tests, groups)

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
