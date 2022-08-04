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
