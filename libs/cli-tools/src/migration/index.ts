import { spawn } from 'child_process'
import { resolve } from 'path'
import { log, rootDir } from '../utils'
import { opts } from './parser'
import { helpText } from './help'

const migrationDir = resolve(rootDir, 'libs/cli-tools/src/migration')
const configPath = resolve(migrationDir, 'config.ts')
const snapshotDir = resolve(migrationDir, 'snapshots')
const tsconfigPath = resolve(rootDir, 'libs/cli-tools/tsconfig.json')
const typeormPath = resolve(rootDir, 'node_modules/.bin/typeorm')

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
