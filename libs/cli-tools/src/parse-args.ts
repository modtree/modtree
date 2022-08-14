import type { Parser, BaseOptions } from './types'

const safeAssign = <T>(t: T, s: Partial<T>) => Object.assign(t, s)

export function parser<T extends BaseOptions>(
  defaultOpts: T,
  parsers: Parser<T>[]
): T {
  // read variables
  const opts = defaultOpts
  const args = process.argv.slice(2)

  for (let i = 0; i < args.length; i++) {
    const parser = parsers.find((p) => p.arg.includes(args[i]))
    if (!parser) continue // continue if parser not found

    if (typeof parser.set === 'function') {
      i += 1
      safeAssign(opts, parser.set(args[i]))
    } else {
      safeAssign(opts, parser.set)
    }
  }
  return opts
}
