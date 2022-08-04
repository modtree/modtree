import path from 'path'
import { helpText } from './help'
import { opts } from './parse-args'
import { isStatusClean } from '../git'
import { fork } from 'child_process'

// paths
const rootDir = path.resolve(__dirname, '../../..')
const dir = {
  root: 'hi',
  e2e: path.resolve(rootDir, 'apps/web-e2e'),
  spec: path.resolve(rootDir, 'apps/web-e2e/cypress/integration'),
  dist: path.resolve(rootDir, 'dist/libs/cy-reporter'),
}

// files
const f = {
  config: path.resolve(dir.e2e, 'cypress.config.js'),
}

// dist
const dist = {
  list: path.resolve(dir.dist, 'list.js'),
}

if (opts.help) {
  console.log(helpText)
  process.exit(0)
}

if (opts.list) {
  fork(dist.list, { stdio: 'inherit' })
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
