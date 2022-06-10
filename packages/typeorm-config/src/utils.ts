import { SupportedDatabases, DataSourceOptions } from '@modtree/types'
import { box } from './box'

const typeTarget = () =>
  process.env.NODE_ENV === 'test' ? 'TEST_DATABASE_TYPE' : 'DATABASE_TYPE'

/**
 * gets project database type from .env
 *
 * @returns {SupportedDatabases}
 */
export function getDatabaseType(): SupportedDatabases {
  if (process.env.NODE_ENV === 'test') return 'postgres'
  const dbType = process.env[typeTarget()].toLowerCase()
  if (dbType === 'postgres') return dbType
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
  const nodeEnv = process.env.NODE_ENV
  // test env overrides everything
  if (nodeEnv === 'test') return `TEST_${dbType}_`
  // defaults to DATABASE_TYPE_
  return `${dbType}_`
}

/**
 * prints the blue box before each run
 *
 * @param {DataSourceOptions} config
 */
export function boxLog(config: DataSourceOptions) {
  const { synchronize, migrationsRun, type, database } = config
  const output = [
    `Environment: ${process.env.NODE_ENV}`,
    `Database:    ${database}`,
    `Engine:      ${type}`,
    `Synchronize: ${synchronize}`,
    `Migrations:  ${migrationsRun}`,
  ]
  box.blue(output.join('\n'))
}
