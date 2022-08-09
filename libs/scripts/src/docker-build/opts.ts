import { parseOpts, Parser, Options } from '../parser'

/**
 * options of the docker-build cli, settable by cli arguments
 */

// default options
const opts: Options = {
  force: false,
  all: false,
  run: false,
  list: false,
  help: false,
}

const parsers: Parser[] = [
  // flag arguments
  {
    arg: ['-f', '--force'],
    type: 'boolean',
    callback: () => (opts.force = true),
  },
  {
    arg: ['-h', '--help'],
    type: 'boolean',
    callback: () => (opts.help = true),
  },
  {
    arg: ['-a', '--all'],
    type: 'boolean',
    callback: () => (opts.all = true),
  },
  // positional arguments
  {
    arg: ['r', 'run'],
    type: 'boolean',
    callback: () => (opts.run = true),
  },
  {
    arg: ['ra', 'run-all'],
    type: 'boolean',
    callback: () => {
      opts.run = true
      opts.all = true
    },
  },
  {
    arg: ['ls', 'list'],
    type: 'boolean',
    callback: () => (opts.list = true),
  },
]
parseOpts(opts, parsers)
export { opts }
