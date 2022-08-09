type ParserFlag =
  | { type: 'string'; callback: (s: string) => void }
  | { type: 'boolean'; callback: () => void }
export type Parser = { arg: string[] } & ParserFlag
export type Options = {
  [key: string]: boolean | string
}

export function parseOpts(opts: Options, parsers: Parser[]): Options {
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
  return opts
}
