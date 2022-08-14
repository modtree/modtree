type ParserFlag =
  | {
      type: 'string'
      callback: (s: string) => void
    }
  | {
      type: 'boolean'
      callback: () => void
    }
export type BaseOptions = {
  [key: string]: string | boolean
}

export type Parser<T extends BaseOptions> = {
  arg: string[]
  set: Partial<T> | ((nextArgument: string) => Partial<T>)
}

export type Options = {
  action: 'unset' | 'open' | 'run' | 'list' | 'help'
  force: boolean
  all: boolean
}
