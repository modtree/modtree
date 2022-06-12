import 'dotenv/config';
import { DataSource } from 'typeorm';
import { ModuleCondensed, Module, User, Degree, Graph } from '@modtree/entity';
import { DataSourceOptions } from '@modtree/types';
import { getDatabaseType, getDatabasePort, getPrefix, boxLog } from './utils';

/**
 * generate a config based on the database type
 *
 * @returns {DataSourceOptions}
 */
function getConfig(): DataSourceOptions {
  const fixed = {
    type: getDatabaseType(),
    rootDir: process.cwd(),
    port: 5432,
    entities: [ModuleCondensed, Module, User, Degree, Graph],
    host: 'localhost',
    database: 'modtree',
    restoreSource: 'postgres-modules-only.sql',
    synchronize: true,
    migrationsRun: false,
    migrations: [],
    extra: false,
  };
  // const prefix = (e: string) => process.env[getPrefix() + e] || undefined;
  // const almost = {
  //   type: getDatabaseType(),
  //   rootDir: process.cwd(),
  //   port: getDatabasePort(),
  //   entities: [ModuleCondensed, Module, User, Degree, Graph],
  //   migrations: ['dist/migrations/*.{js,ts}'],
  //   username: prefix('USERNAME'),
  //   password: prefix('PASSWORD'),
  //   host: prefix('HOST') || 'localhost',
  //   database: prefix('ACTIVE_DATABASE') || 'modtree',
  //   restoreSource: prefix('RESTORE_SOURCE') || 'postgres-modules-only.sql',
  //   synchronize: prefix('SYNC') !== 'false', // defaults to true
  //   migrationsRun: prefix('MIGRATIONS_RUN') === 'true', // defaults to false
  //   extra:
  //     prefix('USE_SSL') === 'true' // defaults to false
  //       ? {
  //           ssl: {
  //             rejectUnauthorized: false,
  //           },
  //         }
  //       : undefined,
  // };
  // boxLog(fixed);
  return fixed;
}

export const config = getConfig();

export const db = new DataSource({
  ...config,
});

export * from './data-source';
