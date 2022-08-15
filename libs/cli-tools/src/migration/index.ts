import { spawn } from 'child_process'
import { resolve } from 'path'
import { log, rootDir } from '../utils'
import { opts } from './parser'

const migrationDir = resolve(rootDir, 'libs/cli-tools/src/migration')
const configPath = resolve(migrationDir, 'config.ts')
const snapshotDir = resolve(migrationDir, 'snapshots')
const tsconfigPath = resolve(rootDir, 'libs/cli-tools/tsconfig.json')
const typeormPath = resolve(rootDir, 'node_modules/.bin/typeorm')

const helpText = `
modtree migration tool

USAGE: yarn mg COMMAND [NAME]

COMMAND
      c, check      check to see if a migration is required
      g, gen        generate a migration
      r, run        run all the migrations that have not ran

EXAMPLES
      yarn mg check
      yarn mg gen cool_migration_name
      yarn mg run
`

function getTailArgs() {
  const tail: string[] = []
  if (opts.action === 'generate') {
    tail.push(resolve(snapshotDir, opts.name))
    if (opts.check) {
      tail.push('--check')
    } else if (opts.dryRun) {
      tail.push('--dryrun')
    }
  }
  return tail
}

function migration() {
  // send help text if no action is found
  if (opts.action === 'unset') {
    return log.normal(helpText)
  }
  // special help text to help with migration generation
  if (!opts.name && opts.action === 'generate') {
    log.normal(helpText)
    return log.warn('generating a migration requires a name')
  }
  spawn(
    'yarn',
    [
      '--silent',
      'ts-node',
      '--project',
      tsconfigPath,
      '--require',
      'tsconfig-paths/register',
      typeormPath,
      `migration:${opts.action}`,
      '--dataSource',
      configPath,
      ...getTailArgs(),
    ],
    { stdio: 'inherit' }
  )
}
migration()
