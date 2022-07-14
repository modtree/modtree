import type { Test, TestAlias, TestGroup } from './types'

function parseTestsFromJson(json: Record<string, string>): Test[] {
  return Object.entries(json).reduce(
    (acc, [name, path]) => [...acc, { name, path, groups: [] }],
    [] as Test[]
  )
}

function parseGroupsFromJson(
  json: Record<string, Omit<TestGroup, 'name'>>
): TestGroup[] {
  return Object.entries(json).reduce(
    (acc, [name, props]) => [...acc, { name, ...props }],
    [] as TestGroup[]
  )
}

function parseAliasesFromJson(json: Record<string, string>): TestAlias[] {
  return Object.entries(json).reduce(
    (acc, [alias, target]) => [...acc, { alias, target }],
    [] as TestAlias[]
  )
}

export const parse = {
  tests: parseTestsFromJson,
  groups: parseGroupsFromJson,
  aliases: parseAliasesFromJson,
}
