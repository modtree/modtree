import type { Parser, BaseCliOptions } from './types'

const safeAssign = <T>(t: T, s: Partial<T>) => Object.assign(t, s)

/**
 * returns parsed CLI options
 *
 * @param {T} opts - default options (will be mutated)
 * @param {Parser<T>[]} parsers
 * @param {string[]} args
 * @returns {T}
 */
export function parser<T extends BaseCliOptions>(
  opts: T,
  parsers: Parser<T>[],
  args: string[] = process.argv.slice(2)
): T {
  for (let i = 0; i < args.length; i++) {
    const parser = parsers.find((p) => p.arg.includes(args[i]))
    if (!parser) continue // continue if parser not found
    const set = parser.set
    safeAssign(opts, typeof set === 'function' ? set(args[++i]) : set)
  }
  return opts
}
