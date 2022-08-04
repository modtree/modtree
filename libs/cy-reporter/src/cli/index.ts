import path from 'path'
import { helpText } from './help'
import { opts } from './parse-args'
import { fork, spawn } from 'child_process'
import { isStatusClean } from '../git'
import { log } from '../utils'

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

// check for a clean git status before running
if (opts.run && !isStatusClean()) {
  log.warn('Warning: git status is not clean.')
  if (!opts.force) process.exit(1)
}

if (opts.run && opts.all) {
  log.green('Running all tests')
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
    log.green('Running test:', target)
    fork(exe.cypress, [path.resolve(dir.spec, target)])
  })
}
