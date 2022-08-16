import { parseArgs } from '../utils'
import type { Parser } from '../types'

type Options = {
  positionalArgs: string[]
  action: 'generate' | 'run' | 'unset'
  name: string
  check: boolean
  dryRun: boolean
}

const defaultOpts: Options = {
  positionalArgs: [],
  action: 'unset',
  name: '',
  check: false,
  dryRun: false,
}

const parsers: Parser<Options>[] = [
  {
    arg: ['--ch', '--check'],
    set: { check: true },
  },
  {
    arg: ['--dr', '--dryrun'],
    set: { dryRun: true },
  },
  {
    arg: ['r', 'run'],
    set: { action: 'run' },
  },
  {
    arg: ['g', 'gen', 'generate'],
    set: (name) => ({ name, action: 'generate' }),
  },
  {
    arg: ['c', 'check'],
    set: { name: '_', action: 'generate', check: true },
  },
]

export const opts = parseArgs(defaultOpts, parsers)
