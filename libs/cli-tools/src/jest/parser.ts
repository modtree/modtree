import { parser } from '../parse-args'

/**
 * options of the cy-reporter cli, settable by cli arguments
 */

type Options = {
  action: 'unset' | 'run' | 'help'
  all: boolean
}

// default options
let opts: Options = {
  action: 'run',
  all: false,
}

parser(
  [
    {
      arg: ['-h', '--help'],
      option: 'action',
      value: 'help',
    },
    {
      arg: ['-a', '--all'],
      option: 'all',
      value: true,
    },
  ],
  opts
)

export { opts }
