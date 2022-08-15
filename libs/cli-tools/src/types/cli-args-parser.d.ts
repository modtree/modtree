export type BaseCliOptions = {
  positionalArgs: string[]
  [key: string]: string | string[] | boolean
}

export type Parser<T extends BaseCliOptions> = {
  arg: string[]
  set: Partial<T> | ((nextArgument: string) => Partial<T>)
}

export type Options = {
  action: 'unset' | 'open' | 'run' | 'list' | 'help'
  force: boolean
  all: boolean
}
