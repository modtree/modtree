import path from 'path'
import { helpText } from './help'
import { opts } from './parse-args'
import { fork, spawn } from 'child_process'
import { green } from 'chalk'

// paths
const rootDir = path.resolve(__dirname, '../../..')
const e2eDir = path.resolve(rootDir, 'apps/web-e2e')
const dir = {
  root: rootDir,
  e2e: e2eDir,
  reporters: path.resolve(e2eDir, 'reporters'),
  spec: path.resolve(e2eDir, 'cypress/integration'),
  dist: path.resolve(rootDir, 'dist/libs/cy-reporter'),
}

// files
const f = {
  config: path.resolve(dir.e2e, 'cypress.config.js'),
}

// dist
const exe = {
  list: path.resolve(dir.dist, 'list.js'),
  cypress: path.resolve(dir.reporters, 'cypress.js'),
}

if (opts.help) {
  console.log(helpText)
  process.exit(0)
}

if (opts.list) {
  opts.run = false
  fork(exe.list, { stdio: 'inherit' })
}

if (opts.run && opts.all) {
  console.log(green('Running all tests'))
  fork(exe.cypress, ['--all'])
}

if (opts.run && !opts.all) {
  const fzf = spawn(
    'fzf',
    [
      '+m',
      '--height=7',
      '--no-mouse',
      '--reverse',
      '--no-info',
      '--header=Select a cypress test:',
      '--header-first',
      '--color=pointer:green,header:white',
    ],
    {
      cwd: dir.spec,
      stdio: ['inherit', 'pipe', 'pipe'],
    }
  )
  // reflect stderr (fzf search suggestions)
  fzf.stderr.on('data', (d) => process.stderr.write(d))
  // handle stdout (fzf selected entry)
  fzf.stdout.setEncoding('utf8')
  fzf.stdout.on('data', (data: string) => {
    const target = data.trim()
    console.log(green('Running test:', target))
    fork(exe.cypress, [path.resolve(dir.spec, target)])
  })
}

// handle flag switches
// handle flags with argument
// handle positional arguments

// const argMap = [
//   {
//     flag: '-f',
//     next: (arg) => (opts.force = arg),
//   },
// ]

// handle_flag_args() {
//     -f | --force)
//     -a | --all)
//     -af | -fa)
//
//   r | run)
//   ra | run-all)
//   ls | list)
