import path from 'path'
import { helpText } from './help'
import { opts } from './parse-args'

// paths
const rootDir = path.resolve(__dirname, '../..')
const dir = {
  root: 'hi',
  e2e: path.resolve(rootDir, 'apps/web-e2e'),
  spec: path.resolve(rootDir, 'apps/web-e2e/cypress/integration'),
}

// files
const f = {
  config: path.resolve(dir.e2e, 'cypress.config.js'),
}

console.log(opts)
console.log(helpText)

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
