import { parseArgs } from '../utils'
import type { Parser } from '../types'

type Options = {
  action: 'unset' | 'run' | 'help'
  all: boolean
  match: string
  positionalArgs: string[]
}

const defaultOpts: Options = {
  positionalArgs: [],
  action: 'run',
  all: false,
  match: '',
}

const parsers: Parser<Options>[] = [
  {
    arg: ['-h', '--help'],
    set: { action: 'help' },
  },
  {
    arg: ['-a', '--all'],
    set: { all: true },
  },
  {
    arg: ['-m', '--match'],
    set: (match) => ({ match }),
  },
]

export const opts = parseArgs(defaultOpts, parsers)
