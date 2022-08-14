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
  action: 'unset' | 'open' | 'run' | 'list' | 'help'
  force: boolean
  all: boolean
}
