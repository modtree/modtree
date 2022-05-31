import { SupportedDatabases, DataSourceOptions } from '../../types/modtree'
import { box } from '../cli'

/**
 * gets project database type from .env
 * @return {DatabaseType}
 */
export function getDatabaseType(): SupportedDatabases {
  const env = process.env.DATABASE_TYPE.toLowerCase()
  if (env === 'postgres') return env
  return 'mysql'
}

/**
 * @return {number} the default port of each database
 */
export function getDatabasePort(): number {
  const env = process.env.DATABASE_TYPE
  if (env === 'POSTGRES') return 5432
  return 3306
}

/**
 * @return {string} the default port of each database
 */
export function getPrefix(): string {
  const type = process.env.DATABASE_TYPE
  const nodeEnv = process.env.NODE_ENV
  // test env overrides everything
  if (nodeEnv === 'test') return `TEST_${type}_`
  // defaults to DATABASE_TYPE_
  return `${type}_`
}

/**
 * prints the blue box before each run
 * @param {DataSourceOptions} config
 */
export function boxLog(config: DataSourceOptions) {
  const output = [
    `Environment: ${process.env.NODE_ENV}`,
    `type:        ${process.env.DATABASE_TYPE}`,
    `Database:    ${config.database}`,
    `Engine:      ${config.type}`,
    `Synchronize: ${config.synchronize}`,
    `Migrations:  ${config.migrationsRun}`,
  ]
  box.blue(output.join('\n'))
}
