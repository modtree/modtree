import { helpText } from './help'
import { opts } from './parse-args'
import { fork } from 'child_process'
import { log, isStatusClean } from '../utils'
import { list } from './list'
import { paths } from '../config'
import { selectAndRun } from './run'

if (opts.action === 'help') {
  console.log(helpText)
  process.exit(0)
}

if (opts.action === 'list') {
  list()
}

if (opts.action === 'open') {
  fork(paths.executable.open, { stdio: 'inherit' })
}

// check for a clean git status before running
if (opts.action === 'run' && !isStatusClean()) {
  log.warn('Warning: git status is not clean.')
  if (!opts.force) process.exit(1)
}

// run all tests
if (opts.action === 'run' && opts.all) {
  log.green('Running all tests')
  fork(paths.executable.run, ['--all'])
}

// select one test and run
if (opts.action === 'run' && !opts.all) {
  selectAndRun(paths.dir.spec)
}
