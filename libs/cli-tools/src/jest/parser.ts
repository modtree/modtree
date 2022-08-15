import { parser } from '../utils'

/**
 * options of the cy-reporter cli, settable by cli arguments
 */

type Options = {
  action: 'unset' | 'run' | 'help'
  all: boolean
  match: string
}

// default options
let opts: Options = {
  action: 'run',
  all: false,
  match: '',
}

const output = parser(opts, [
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
])
console.log(output)

export { opts }
