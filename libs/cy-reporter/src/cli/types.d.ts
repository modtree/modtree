type ParserFlag =
  | {
      type: 'string'
      callback: (s: string) => void
    }
  | {
      type: 'boolean'
      callback: () => void
    }
export type Parser = { arg: string[] } & ParserFlag

export type Options = {
  force: boolean
  all: boolean
  run: boolean
  list: boolean
  help: boolean
}
