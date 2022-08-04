import type { Parser, Options } from './types'

/**
 * options of the cy-reporter cli, settable by cli arguments
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

const args = process.argv.slice(2)
if (args.length === 0) opts.help = true
for (let i = 0; i < args.length; i++) {
  const parser = parsers.find((p) => p.arg.includes(args[i]))

  // continue if parser not found
  if (!parser) continue

  // execute callback immediately if it's a boolean option
  if (parser.type === 'boolean') {
    parser.callback()
  }

  // execute callback on next argument if it's a string option
  if (parser.type === 'string') {
    parser.callback(args[i + 1])
    i += 1 // skip the next argument
  }
}

export { opts }
