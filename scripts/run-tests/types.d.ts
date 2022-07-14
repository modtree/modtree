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
