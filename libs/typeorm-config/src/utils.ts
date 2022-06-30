import { SupportedDatabases } from '@modtree/types'
import { join } from 'path'
import fs from 'fs'

const rootDir = join(__dirname, '../../..')

/**
 * gets project database type from .env
 *
 * @returns {SupportedDatabases}
 */
export function getDatabaseType(): SupportedDatabases {
  /**
   * left here as a function for future
   * e x t e n s i b i r i t y
   */
  return 'postgres'
}

/**
 * @returns {number} the default port of each database
 */
export function getDatabasePort(): number {
  const dbType = getDatabaseType()
  if (dbType === 'postgres') return 5432
  return 3306
}

/**
 * @returns {string} the default port of each database
 */
export function getPrefix(): string {
  const dbType = getDatabaseType().toUpperCase()
  const nodeEnv = process.env['NODE_ENV']
  // test env overrides everything
  if (nodeEnv === 'test') return `TEST_${dbType}_`
  // defaults to DATABASE_TYPE_
  return `${dbType}_`
}

export function rawJson(filename: string) {
  return JSON.parse(fs.readFileSync(join(rootDir, filename)).toString())
}
