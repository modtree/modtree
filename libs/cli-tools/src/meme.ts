type OptsLiteral = {
  action: 'run' | 'open'
  one: string
  two: boolean
}

const opts = { action: 'run' as 'run' | 'open', one: 'value', two: true }

type Obj = {
  [key: string]: string | boolean | undefined
}

type Opts = {
  [key: string]: string | boolean | undefined
}

type Parser<T> = {
  value: Partial<T>
}

function parser<T extends Opts>(parser: Parser<T>[], opts: T) {
  return
}

parser(
  [
    {
      value: { action: 'run' },
    },
    {
      key: 'one',
      value: 'hello',
    },
    {
      key: 'two',
      value: 'yes',
    },
  ],
  opts
)
